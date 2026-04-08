<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Chat endpoints
    Route::get('chats', [App\Http\Controllers\ChatController::class, 'index'])->name('chats.index');
    Route::get('api/chats/search', [App\Http\Controllers\ChatController::class, 'searchUsers'])->name('api.chats.search');
    Route::post('chats/request', [App\Http\Controllers\ChatController::class, 'sendRequest'])->name('chats.request');
    Route::post('chats/accept', [App\Http\Controllers\ChatController::class, 'acceptRequest'])->name('chats.accept');
    Route::post('chats/groups', [App\Http\Controllers\ChatController::class, 'createGroup'])->name('chats.groups.create');
    
    // Map Endpoints
    Route::get('map', [App\Http\Controllers\TouristMapController::class, 'index'])->name('map.index');
    Route::post('map/places', [App\Http\Controllers\TouristMapController::class, 'store'])->name('map.places.store');
    Route::post('map/places/{place}/rate', [App\Http\Controllers\TouristMapController::class, 'rate'])->name('map.places.rate');
});

require __DIR__ . '/settings.php';


Route::inertia("/conoce-nl", 'info/conoce-nl')->name('conoce-nl');
Route::inertia("/nosotros", 'info/nosotros')->name('nosotros');


//Pruebas
// Route::inertia('/prueba', function () {
//     return ('prueba');
// })->name('prueba');

Route::inertia("/prueba", 'prueba', ['prueba' => 'prueba'])->name('prueba');