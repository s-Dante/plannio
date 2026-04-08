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
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // Obtener todos los grupos en los que participa el usuario, precargando miembros para derivar información de chats individuales
        $groups = $user->groups()->with('members')->get()->map(function ($group) use ($user) {
            if ($group->is_individual) {
                // El otro usuario
                $otherUser = $group->members->firstWhere('id', '!=', $user->id);
                if ($otherUser) {
                    $group->name = $otherUser->name . ' ' . $otherUser->father_lastname;
                    $group->avatar = $otherUser->avatar;
                }
            }
            return $group;
        });

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

    public function sendRequest(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id'
        ]);

        /** @var \App\Models\User $user */
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

        // Disparar evento de broadcasting en tiempo real
        broadcast(new \App\Events\FriendRequestReceived($friendId, $user))->toOthers();

        return back()->with('success', 'Solicitud de amistad enviada.');
    }

    public function acceptRequest(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id'
        ]);

        /** @var \App\Models\User $user */
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

            // Broadcast to the original sender that their request was accepted & the group created
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

            // Group creation broadcast
            broadcast(new \App\Events\GroupCreated($group, $userIds))->toOthers();

            return $group;
        });

        return back()->with('success', 'Grupo creado exitosamente.');
    }
}
