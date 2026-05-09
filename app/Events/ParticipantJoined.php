<?php

namespace App\Events;

use App\Models\Call;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ParticipantJoined implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $data;

    public function __construct(Call $call, User $user, string $peerId)
    {
        $this->data = [
            'call_id'  => $call->id,
            'group_id' => $call->group_id,
            'user'     => [
                'id'     => $user->id,
                'name'   => $user->name . ' ' . $user->father_lastname,
                'avatar' => $user->avatar,
            ],
            'peer_id'  => $peerId,
        ];
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->data['group_id']),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ParticipantJoined';
    }
}
