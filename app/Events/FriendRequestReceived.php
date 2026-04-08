<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FriendRequestReceived implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $friendId;
    public $sender;

    public function __construct($friendId, $sender)
    {
        $this->friendId = $friendId;
        $this->sender = $sender;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->friendId),
        ];
    }
}
