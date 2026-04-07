<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Enums\MessageTypeEnum;

class Message extends Model
{
    /** @use HasFactory<\Database\Factories\MessageFactory> */
    use HasFactory;

    protected $fillable = [
        'group_id',
        'user_id',
        'type',
        'content',
        'media_url',
        'mime_type',
        'file_size',
        'latitude',
        'longitude',
        'is_encrypted',
    ];

    protected function casts(): array
    {
        return [
            'type' => MessageTypeEnum::class,
            'is_encrypted' => 'boolean',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }
}
