<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::inertia('chats', 'Chats/Index')->name('chats.index');
    Route::inertia('map', 'TouristMap/Index')->name('map.index');
});

require __DIR__ . '/settings.php';


Route::inertia("/conoce-nl", 'info/conoce-nl')->name('conoce-nl');
Route::inertia("/nosotros", 'info/nosotros')->name('nosotros');


//Pruebas
// Route::inertia('/prueba', function () {
//     return ('prueba');
// })->name('prueba');

Route::inertia("/prueba", 'prueba', ['prueba' => 'prueba'])->name('prueba');