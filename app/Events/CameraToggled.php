<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CameraToggled implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int  $groupId,
        public readonly int  $userId,
        public readonly bool $camOff,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('chat.' . $this->groupId)];
    }

    public function broadcastAs(): string
    {
        return 'CameraToggled';
    }

    public function broadcastWith(): array
    {
        return [
            'user_id' => $this->userId,
            'cam_off' => $this->camOff,
        ];
    }
}
