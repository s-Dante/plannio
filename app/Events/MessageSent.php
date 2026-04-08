<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $groupId;

    public function __construct(Message $message)
    {
        // Pre-load the user relation for frontend display
        $message->load('user');
        $this->message = $message;
        $this->groupId = $message->group_id;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->groupId),
        ];
    }
}
