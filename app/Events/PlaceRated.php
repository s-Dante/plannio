<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Place;

class PlaceRated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $placeId;
    public $newAverage;
    public $totalVotes;

    public function __construct(Place $place)
    {
        $this->placeId = $place->id;
        $this->newAverage = $place->rating;
        $this->totalVotes = $place->ratings()->count();
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('tourist-map'),
        ];
    }
}
