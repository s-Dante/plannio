<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CallParticipant extends Model
{
    /** @use HasFactory<\Database\Factories\CallParticipantFactory> */
    use HasFactory;

    protected $fillable = [
        'call_id',
        'user_id',
        'joined_at',
        'left_at',
    ];

    public function casts(): array
    {
        return [
            'joined_at' => 'datetime',
            'left_at' => 'datetime',
        ];
    }
}
