<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Call;
use App\Models\CallParticipant;
use App\Enums\CallStatusEnum;
use App\Enums\CallTypeEnum;
use App\Events\CallInitiated;
use App\Events\CallEnded;
use App\Events\CameraToggled;
use App\Events\ParticipantJoined;
use App\Events\ParticipantLeft;

class CallController extends Controller
{
    /**
     * Inicia una nueva llamada en un grupo.
     */
    public function initiate(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'type'     => 'required|integer|in:1,2',
            'peer_id'  => 'required|string|max:255',
        ]);

        $user = $request->user();

        // Como precausion verificamos que el usuario si sea parte del grupo
        $isMember = $user->groups()->where('groups.id', $request->group_id)->exists();
        if (! $isMember) {
            return response()->json(['error' => 'No perteneces a este grupo.'], 403);
        }

        // Verificamos que no exista ya una llaada en procso
        $activeCall = Call::where('group_id', $request->group_id)
            ->whereIn('status', [CallStatusEnum::INITIATED->value, CallStatusEnum::ONGOING->value])
            ->first();

        if ($activeCall) {
            return response()->json([
                'call'         => $activeCall->load('participants'),
                'participants' => $this->getParticipantsWithPeers($activeCall),
                'already_active' => true,
            ]);
        }

        $call = Call::create([
            'group_id'   => $request->group_id,
            'caller_id'  => $user->id,
            'type'       => $request->type,
            'status'     => CallStatusEnum::INITIATED->value,
            'started_at' => now(),
        ]);

        CallParticipant::create([
            'call_id'   => $call->id,
            'user_id'   => $user->id,
            'peer_id'   => $request->peer_id,
            'joined_at' => now(),
        ]);

        broadcast(new CallInitiated($call, $user, $request->peer_id))->toOthers();

        return response()->json([
            'call'         => $call,
            'participants' => [],
            'already_active' => false,
        ]);
    }

    /**
     * Un usuario se une a una llamada existente.
     */
    public function join(Request $request, Call $call)
    {
        $request->validate([
            'peer_id' => 'required|string|max:255',
        ]);

        $user = $request->user();

        // Como precausion verificamos que el usuario si sea parte del grupo
        $isMember = $user->groups()->where('groups.id', $call->group_id)->exists();
        if (! $isMember) {
            return response()->json(['error' => 'No perteneces a este grupo.'], 403);
        }

        // Verificamos que la llamada sigue activa
        if (! in_array($call->status->value, [CallStatusEnum::INITIATED->value, CallStatusEnum::ONGOING->value])) {
            return response()->json(['error' => 'La llamada ya terminó.'], 422);
        }

        CallParticipant::updateOrCreate(
            ['call_id' => $call->id, 'user_id' => $user->id],
            ['peer_id' => $request->peer_id, 'joined_at' => now(), 'left_at' => null]
        );

        if ($call->status->value === CallStatusEnum::INITIATED->value) {
            $call->update(['status' => CallStatusEnum::ONGOING->value]);
        }

        // Obtenemos el id de peer para que el nuevo los llame
        $existingParticipants = $this->getParticipantsWithPeers($call, $user->id);

        broadcast(new ParticipantJoined($call, $user, $request->peer_id))->toOthers();

        return response()->json([
            'call'         => $call->fresh(),
            'participants' => $existingParticipants,
        ]);
    }

    /**
     * Un usuario abandona la llamada.
     */
    public function leave(Request $request, Call $call)
    {
        $user = $request->user();

        CallParticipant::where('call_id', $call->id)
            ->where('user_id', $user->id)
            ->update(['left_at' => now()]);

        broadcast(new ParticipantLeft($call, $user))->toOthers();

        // Revisamos que aún queden participantes activos
        $activeCount = CallParticipant::where('call_id', $call->id)
            ->whereNull('left_at')
            ->count();

        if ($activeCount === 0) {
            $this->endCall($call);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Un usuario rechaza la llamada.
     */
    public function reject(Request $request, Call $call)
    {
        $group = \App\Models\Group::find($call->group_id);
        
        // Si el grupo es individual terminamos la llamada para ambos
        if ($group && $group->is_individual) {
            $this->endCall($call);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Notificamos a los demás participantes que el usuario apagó/encendió la cámara.
     */
    public function cameraToggle(Request $request, Call $call)
    {
        $request->validate(['cam_off' => 'required|boolean']);

        $user = $request->user();
        $isMember = $user->groups()->where('groups.id', $call->group_id)->exists();
        if (! $isMember) {
            return response()->json(['error' => 'No autorizado.'], 403);
        }

        broadcast(new CameraToggled($call->group_id, $user->id, $request->boolean('cam_off')))->toOthers();

        return response()->json(['ok' => true]);
    }

    /**
     * Terminar la llamada completamente.
     */
    public function end(Request $request, Call $call)
    {
        $user = $request->user();

        $isMember = $user->groups()->where('groups.id', $call->group_id)->exists();
        if (! $isMember) {
            return response()->json(['error' => 'No autorizado.'], 403);
        }

        CallParticipant::where('call_id', $call->id)
            ->whereNull('left_at')
            ->update(['left_at' => now()]);

        $this->endCall($call);

        return response()->json(['ok' => true]);
    }

    /**
     * Obtener el estado actual de una llamada).
     */
    public function show(Request $request, Call $call)
    {
        $user = $request->user();
        $isMember = $user->groups()->where('groups.id', $call->group_id)->exists();
        if (! $isMember) {
            return response()->json(['error' => 'No autorizado.'], 403);
        }

        return response()->json([
            'call'         => $call,
            'participants' => $this->getParticipantsWithPeers($call),
        ]);
    }


    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────
    /**
     * Terminamos la llamada
     */
    private function endCall(Call $call): void
    {
        $startedAt = $call->started_at ?? now();
        $duration  = (int) now()->diffInSeconds($startedAt);

        $call->update([
            'status'   => CallStatusEnum::ENDED->value,
            'ended_at' => now(),
            'duration' => $duration,
        ]);

        broadcast(new CallEnded($call));
    }

    /**
     * Devuelve los participantes activos de una llamada con su id de peer,
     */
    private function getParticipantsWithPeers(Call $call, ?int $excludeUserId = null): array
    {
        $query = CallParticipant::where('call_id', $call->id)
            ->whereNull('left_at')
            ->with('user:id,name,father_lastname,avatar');

        if ($excludeUserId) {
            $query->where('user_id', '!=', $excludeUserId);
        }

        return $query->get()->map(fn ($p) => [
            'user_id' => $p->user_id,
            'peer_id' => $p->peer_id,
            'name'    => $p->user?->name . ' ' . $p->user?->father_lastname,
            'avatar'  => $p->user?->avatar,
        ])->toArray();
    }
}
