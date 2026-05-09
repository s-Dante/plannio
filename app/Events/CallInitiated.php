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
        return [
            new PrivateChannel('chat.' . $this->callData['group_id']),
        ];
    }

    public function broadcastAs(): string
    {
        return 'CallInitiated';
    }
}
