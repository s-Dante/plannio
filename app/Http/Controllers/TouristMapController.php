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
     * Cargamos el mapa con todos los lugares que exiten en la BD.
     */
    public function index(): Response
    {
        $places = Place::with(['ratings.user', 'creator'])->get();

        return Inertia::render('TouristMap/Index', [
            'places' => $places,
            'categories' => PlaceCategoryEnum::getOptions()
        ]);
    }

    /**
     * Guardamos un nuevo punto en el mapa.
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
            'created_by' => $request->user()->id,
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
     * Guardamos una calificación de un usuario a un punto del mapa.
     */
    public function rate(Request $request, Place $place)
    {
        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $place->rateByUser($request->user()->id, $validated['rating'], $validated['comment']);

        // Enviamos el evento a broadcast para que todos los usuarios vean el cambio.
        broadcast(new \App\Events\PlaceRated($place))->toOthers();

        return back()->with('success', '¡Gracias por calificar este lugar!');
    }
}
