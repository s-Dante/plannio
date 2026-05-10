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
    Route::get('api/chats/users', [App\Http\Controllers\ChatController::class, 'listUsers'])->name('api.chats.users');
    Route::post('chats/request', [App\Http\Controllers\ChatController::class, 'sendRequest'])->name('chats.request');
    Route::post('chats/accept', [App\Http\Controllers\ChatController::class, 'acceptRequest'])->name('chats.accept');
    Route::post('chats/groups', [App\Http\Controllers\ChatController::class, 'createGroup'])->name('chats.groups.create');
    Route::get('chats/{group}/messages', [App\Http\Controllers\MessageController::class, 'index'])->name('chats.messages.index');
    Route::post('chats/{group}/messages', [App\Http\Controllers\MessageController::class, 'store'])->name('chats.messages.store');
    
    // Map Endpoints
    Route::get('map', [App\Http\Controllers\TouristMapController::class, 'index'])->name('map.index');
    Route::post('map/places', [App\Http\Controllers\TouristMapController::class, 'store'])->name('map.places.store');
    Route::post('map/places/{place}/rate', [App\Http\Controllers\TouristMapController::class, 'rate'])->name('map.places.rate');

    // Task Endpoints
    Route::get('tasks', [App\Http\Controllers\TaskController::class, 'index'])->name('tasks.index');
    Route::post('tasks', [App\Http\Controllers\TaskController::class, 'store'])->name('tasks.store');
    Route::put('tasks/{task}', [App\Http\Controllers\TaskController::class, 'update'])->name('tasks.update');
    Route::put('tasks/{task}/status', [App\Http\Controllers\TaskController::class, 'updateStatus'])->name('tasks.status.update');
    Route::delete('tasks/{task}', [App\Http\Controllers\TaskController::class, 'destroy'])->name('tasks.destroy');

    // Rewards Endpoints
    Route::get('rewards', [App\Http\Controllers\RewardController::class, 'index'])->name('rewards.index');
    Route::post('rewards/{reward}/equip', [App\Http\Controllers\RewardController::class, 'toggleEquip'])->name('rewards.equip');

    // Call Endpoints
    Route::post('calls/initiate', [App\Http\Controllers\CallController::class, 'initiate'])->name('calls.initiate');
    Route::post('calls/{call}/join', [App\Http\Controllers\CallController::class, 'join'])->name('calls.join');
    Route::post('calls/{call}/leave', [App\Http\Controllers\CallController::class, 'leave'])->name('calls.leave');
    Route::post('calls/{call}/reject', [App\Http\Controllers\CallController::class, 'reject'])->name('calls.reject');
    Route::post('calls/{call}/end', [App\Http\Controllers\CallController::class, 'end'])->name('calls.end');
    Route::get('calls/{call}', [App\Http\Controllers\CallController::class, 'show'])->name('calls.show');
});

require __DIR__ . '/settings.php';


Route::inertia("/conoce-nl", 'info/conoce-nl')->name('conoce-nl');
Route::inertia("/nosotros", 'info/nosotros')->name('nosotros');


//Pruebas
// Route::inertia('/prueba', function () {
//     return ('prueba');
// })->name('prueba');

Route::inertia("/prueba", 'prueba', ['prueba' => 'prueba'])->name('prueba');