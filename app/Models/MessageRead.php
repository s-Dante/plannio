<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageRead extends Model
{
    /** @use HasFactory<\Database\Factories\MessageReadFactory> */
    use HasFactory;

    protected $fillable = [
        'message_id',
        'user_id',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'message_id' => 'integer',
            'user_id' => 'integer',
            'read_at' => 'datetime',
        ];
    }
}
