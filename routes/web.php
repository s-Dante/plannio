<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__ . '/settings.php';



//Pruebas
// Route::inertia('/prueba', function () {
//     return ('prueba');
// })->name('prueba');

Route::inertia("/prueba", 'prueba', ['prueba' => 'prueba'])->name('prueba');