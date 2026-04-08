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
    // Only allow if the user is a member of this chat/group
    return \App\Models\Group::where('id', $groupId)
        ->whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->exists();
});
