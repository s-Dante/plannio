<?php

namespace App\Http\Controllers;

use App\Models\Place;
use App\Enums\PlaceCategoryEnum;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TouristMapController extends Controller
{
    /**
     * Display the tourist map with all places.
     */
    public function index(): Response
    {
        // Get all places along with their ratings and creator.
        $places = Place::with(['ratings.user', 'creator'])->get();

        return Inertia::render('TouristMap/Index', [
            'places' => $places,
            'categories' => PlaceCategoryEnum::getOptions()
        ]);
    }

    /**
     * Store a newly created map place.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'category' => 'required|integer',
        ]);

        $place = Place::create([
            'created_by' => auth()->id(),
            'name' => $validated['name'],
            'description' => $validated['description'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'category' => $validated['category'],
            'is_official_venue' => false,
            'average_rating' => 0.00,
            'ratings_count' => 0,
        ]);

        return back()->with('success', '¡Punto de interés agregado exitosamente!');
    }

    /**
     * Rate a specific place.
     */
    public function rate(Request $request, Place $place)
    {
        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $place->rateByUser(auth()->id(), $validated['rating'], $validated['comment']);

        // Dispatch WebSocket Event for Live Rating Sync
        broadcast(new \App\Events\PlaceRated($place))->toOthers();

        return back()->with('success', '¡Gracias por calificar este lugar!');
    }
}
