<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('users.status', function ($user) {
    return ['id' => $user->id, 'name' => $user->name, 'avatar' => $user->avatar];
});

Broadcast::channel('chat.{groupId}', function ($user, $groupId) {
    // Solamente si el usuario es parte del grupo
    return \App\Models\Group::where('id', $groupId)
        ->whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->exists();
});

// Canal de llamadas: autoriza sólo a miembros del grupo al que pertenece la llamada
Broadcast::channel('call.{callId}', function ($user, $callId) {
    $call = \App\Models\Call::find($callId);
    if (! $call) return false;
    return \App\Models\Group::where('id', $call->group_id)
        ->whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->exists();
});
