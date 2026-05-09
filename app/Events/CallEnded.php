<?php

namespace App\Events;

use App\Models\Call;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallEnded implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $callData;

    public function __construct(Call $call)
    {
        $this->callData = [
            'call_id'  => $call->id,
            'group_id' => $call->group_id,
            'duration' => $call->duration,
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
        return 'CallEnded';
    }
}
