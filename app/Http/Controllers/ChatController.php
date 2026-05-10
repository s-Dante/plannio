<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Group;
use App\Models\GroupUser;
use App\Models\Friend;

use App\Enums\FriendshipStatusEnum;

class ChatController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Obtenemos los grupos del usuario y sus miembros, así como sus tareas
        $groups = $user->groups()->with(['members', 'tasks.completions'])->get()->map(function ($group) use ($user) {
            // Si es un chat individual, obtenemos el otro usuario
            if ($group->is_individual) {
                $otherUser = $group->members->firstWhere('id', '!=', $user->id);
                if ($otherUser) {
                    $group->name = $otherUser->name . ' ' . $otherUser->father_lastname;
                    $group->avatar = $otherUser->avatar;
                }
            }
            // Obtener la fecha del último mensaje para ordenar
            $group->last_message_at = $group->messages()->max('created_at');
            return $group;
        })->sortByDesc('last_message_at')->values();

        // Retornamos la vista con los grupos, amigos y solicitudes pendientes
        return Inertia::render('Chats/Index', [
            'groups' => $groups,
            'friends' => $user->friends,
            'pendingRequests' => $user->pendingFriendRequests()->get()->map(function ($senderUser) {
                return [
                    'id' => $senderUser->id,
                    'sender' => $senderUser
                ];
            }),
        ]);
    }

    public function searchUsers(Request $request)
    {
        $query = $request->get('q');
        if (!$query) return response()->json([]);

        $users = User::where('id', '!=', auth()->id())
            ->where(function ($q) use ($query) {
                $q->where('username', 'LIKE', "%{$query}%")
                    ->orWhere('email', 'LIKE', "%{$query}%")
                    ->orWhere('name', 'LIKE', "%{$query}%");
            })
            ->select('id', 'name', 'father_lastname', 'username', 'avatar', 'is_online')
            ->limit(10)
            ->get();

        return response()->json($users);
    }

    public function listUsers(Request $request)
    {
        $authUser = auth()->user();
        $perPage = 10;
        $page = max(1, (int) $request->get('page', 1));

        $users = User::where('id', '!=', $authUser->id)
            ->select('id', 'name', 'father_lastname', 'username', 'avatar', 'is_online')
            ->orderBy('name')
            ->paginate($perPage, ['*'], 'page', $page);

        // Construir mapa de estado de amistad: userId => status
        $friendships = \App\Models\Friend::where('user_id', $authUser->id)
            ->orWhere('friend_id', $authUser->id)
            ->get();

        $friendMap = [];
        foreach ($friendships as $f) {
            $otherId = $f->user_id === $authUser->id ? $f->friend_id : $f->user_id;
            $friendMap[$otherId] = $f->status;
        }

        $items = collect($users->items())->map(function ($user) use ($friendMap) {
            $user->friendship_status = $friendMap[$user->id] ?? null;
            return $user;
        });

        return response()->json([
            'data' => $items,
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'total' => $users->total(),
        ]);
    }

    public function sendRequest(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id'
        ]);

        $user = auth()->user();
        $friendId = $request->friend_id;

        if ($user->id === $friendId) {
            return back()->withErrors(['message' => 'No puedes enviarte una solicitud a ti mismo.']);
        }

        // Verificar si ya existe relación previa
        $existing = Friend::where(function ($q) use ($user, $friendId) {
            $q->where('user_id', $user->id)->where('friend_id', $friendId);
        })->orWhere(function ($q) use ($user, $friendId) {
            $q->where('user_id', $friendId)->where('friend_id', $user->id);
        })->first();

        if ($existing) {
            return back()->withErrors(['message' => 'Ya existe una solicitud o amistad con esta persona.']);
        }

        Friend::create([
            'user_id' => $user->id,
            'friend_id' => $friendId,
            'status' => FriendshipStatusEnum::PENDING->value,
        ]);

        // Bradcast de envio de solicitud para que se reciba en tiempo real
        broadcast(new \App\Events\FriendRequestReceived($friendId, $user))->toOthers();

        return back()->with('success', 'Solicitud de amistad enviada.');
    }

    public function acceptRequest(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id'
        ]);

        $user = auth()->user();
        $friendId = $request->friend_id;

        $friendship = Friend::where('user_id', $friendId)
            ->where('friend_id', $user->id)
            ->where('status', FriendshipStatusEnum::PENDING->value)
            ->firstOrFail();

        DB::transaction(function () use ($friendship, $user, $friendId) {
            $friendship->status = FriendshipStatusEnum::ACCEPTED->value;
            $friendship->save();

            $group = Group::create([
                'name' => 'Individual Chat',
                'description' => '',
                'avatar' => '',
                'is_individual' => true,
                'created_by' => $user->id
            ]);

            GroupUser::create(['group_id' => $group->id, 'user_id' => $user->id, 'role' => 1]);
            GroupUser::create(['group_id' => $group->id, 'user_id' => $friendId, 'role' => 1]);

            $group->name = $user->name . ' ' . $user->father_lastname;
            $group->avatar = $user->avatar;

            // Broadcast de que se acepto la solicitud
            broadcast(new \App\Events\FriendRequestAccepted($friendId, $user, $group))->toOthers();
        });

        return back()->with('success', 'Amistad aceptada exitosamente.');
    }

    public function createGroup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'members' => 'required|array|min:1|max:100',
            'members.*' => 'exists:users,id'
        ]);

        $user = auth()->user();

        $group = DB::transaction(function () use ($request, $user) {
            $logosJPG = [1930, 1934, 1938, 1950, 1954, 1958, 1962];
            $logosPNG = [1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026];
            $randomLogoJPG = $logosJPG[array_rand($logosJPG)];
            $randomLogoPNG = $logosPNG[array_rand($logosPNG)];

            if (rand(0, 1) == 0) {
                $randomLogo = $randomLogoJPG;
                $extension = 'jpg';
            } else {
                $randomLogo = $randomLogoPNG;
                $extension = 'png';
            }

            $group = Group::create([
                'name' => $request->name,
                'description' => $request->description ?? 'Nuevo Grupo',
                'avatar' => "/imgs/assets/wc-fifa-logos/{$randomLogo}.{$extension}",
                'is_individual' => false,
                'created_by' => $user->id
            ]);

            GroupUser::create([
                'group_id' => $group->id,
                'user_id' => $user->id,
                'role' => 2
            ]);

            $userIds = [$user->id];
            foreach ($request->members as $memberId) {
                GroupUser::create([
                    'group_id' => $group->id,
                    'user_id' => $memberId,
                    'role' => 1
                ]);
                $userIds[] = $memberId;
            }

            // Broadcast de que se creo el grupo
            broadcast(new \App\Events\GroupCreated($group, $userIds))->toOthers();

            return $group;
        });

        return back()->with('success', 'Grupo creado exitosamente.');
    }
}
