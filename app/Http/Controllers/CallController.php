<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Call;
use App\Models\CallParticipant;
use App\Enums\CallStatusEnum;
use App\Enums\CallTypeEnum;
use App\Events\CallInitiated;
use App\Events\CallEnded;
use App\Events\ParticipantJoined;
use App\Events\ParticipantLeft;

class CallController extends Controller
{
    /**
     * Inicia una nueva llamada en un grupo.
     * El frontend envía: group_id, type (1=voz / 2=video), peer_id del caller.
     */
    public function initiate(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'type'     => 'required|integer|in:1,2',
            'peer_id'  => 'required|string|max:255',
        ]);

        $user = auth()->user();

        // Verificar que el usuario es miembro del grupo
        $isMember = $user->groups()->where('groups.id', $request->group_id)->exists();
        if (! $isMember) {
            return response()->json(['error' => 'No perteneces a este grupo.'], 403);
        }

        // Verificar que no haya una llamada activa en ese grupo
        $activeCall = Call::where('group_id', $request->group_id)
            ->whereIn('status', [CallStatusEnum::INITIATED->value, CallStatusEnum::ONGOING->value])
            ->first();

        if ($activeCall) {
            // Devolver la llamada activa para que el front pueda unirse
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

        // Registrar al caller como primer participante
        CallParticipant::create([
            'call_id'   => $call->id,
            'user_id'   => $user->id,
            'peer_id'   => $request->peer_id,
            'joined_at' => now(),
        ]);

        broadcast(new CallInitiated($call, $user, $request->peer_id))->toOthers();

        return response()->json([
            'call'         => $call,
            'participants' => [],   // El caller es el único hasta ahora
            'already_active' => false,
        ]);
    }

    /**
     * Un usuario se une a una llamada existente.
     * El frontend envía: peer_id del usuario que se une.
     */
    public function join(Request $request, Call $call)
    {
        $request->validate([
            'peer_id' => 'required|string|max:255',
        ]);

        $user = auth()->user();

        // Verificar membresía
        $isMember = $user->groups()->where('groups.id', $call->group_id)->exists();
        if (! $isMember) {
            return response()->json(['error' => 'No perteneces a este grupo.'], 403);
        }

        // Verificar que la llamada sigue activa
        if (! in_array($call->status->value, [CallStatusEnum::INITIATED->value, CallStatusEnum::ONGOING->value])) {
            return response()->json(['error' => 'La llamada ya terminó.'], 422);
        }

        // Crear o actualizar la participación (puede que ya exista si se reconectó)
        CallParticipant::updateOrCreate(
            ['call_id' => $call->id, 'user_id' => $user->id],
            ['peer_id' => $request->peer_id, 'joined_at' => now(), 'left_at' => null]
        );

        // Marcar la llamada como en curso si aún estaba en INITIATED
        if ($call->status->value === CallStatusEnum::INITIATED->value) {
            $call->update(['status' => CallStatusEnum::ONGOING->value]);
        }

        // Obtener peer_ids de los demás participantes activos (para que el recién unido los llame)
        $existingParticipants = $this->getParticipantsWithPeers($call, $user->id);

        broadcast(new ParticipantJoined($call, $user, $request->peer_id))->toOthers();

        return response()->json([
            'call'         => $call->fresh(),
            'participants' => $existingParticipants,
        ]);
    }

    /**
     * Un usuario abandona la llamada (sin terminarla para los demás).
     */
    public function leave(Request $request, Call $call)
    {
        $user = auth()->user();

        CallParticipant::where('call_id', $call->id)
            ->where('user_id', $user->id)
            ->update(['left_at' => now()]);

        broadcast(new ParticipantLeft($call, $user))->toOthers();

        // Revisar si quedan participantes activos
        $activeCount = CallParticipant::where('call_id', $call->id)
            ->whereNull('left_at')
            ->count();

        if ($activeCount === 0) {
            $this->endCall($call);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Terminar la llamada completamente (desde el caller o cuando todos salieron).
     */
    public function end(Request $request, Call $call)
    {
        $user = auth()->user();

        // Sólo el caller o un miembro del grupo puede forzar el fin
        $isMember = $user->groups()->where('groups.id', $call->group_id)->exists();
        if (! $isMember) {
            return response()->json(['error' => 'No autorizado.'], 403);
        }

        // Marcar a todos como salidos
        CallParticipant::where('call_id', $call->id)
            ->whereNull('left_at')
            ->update(['left_at' => now()]);

        $this->endCall($call);

        return response()->json(['ok' => true]);
    }

    /**
     * Obtener el estado actual de una llamada (participantes + peer_ids).
     */
    public function show(Call $call)
    {
        $user = auth()->user();
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
    // Helpers privados
    // ──────────────────────────────────────────────

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
     * Devuelve los participantes activos de una llamada con su peer_id,
     * opcionalmente excluyendo a un usuario (útil al hacer join).
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
