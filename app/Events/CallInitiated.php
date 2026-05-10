<?php

namespace App\Events;

use App\Models\Call;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallInitiated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $callData;

    public function __construct(Call $call, User $caller, string $peerId)
    {
        $this->callData = [
            'call_id'   => $call->id,
            'group_id'  => $call->group_id,
            'type'      => $call->type->value,  // 1=voz, 2=video (int primitivo, no enum)
            'status'    => $call->status,
            'caller'    => [
                'id'     => $caller->id,
                'name'   => $caller->name . ' ' . $caller->father_lastname,
                'avatar' => $caller->avatar,
            ],
            'peer_id'   => $peerId,
        ];
    }

    public function broadcastOn(): array
    {
        $group = \App\Models\Group::find($this->callData['group_id']);
        $channels = [new PrivateChannel('chat.' . $this->callData['group_id'])];

        if ($group) {
            foreach ($group->members as $member) {
                // No enviar al que inicia la llamada (opcional, pero buena práctica)
                if ($member->id !== $this->callData['caller']['id']) {
                    $channels[] = new PrivateChannel('user.' . $member->id);
                }
            }
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'CallInitiated';
    }
}
