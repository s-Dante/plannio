<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserUnlockedReward extends Model
{
    /** @use HasFactory<\Database\Factories\UserUnlockedRewardFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reward_id',
        'unlocked_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'unlocked_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }
}
