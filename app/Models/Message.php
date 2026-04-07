<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use App\Models\User;
use App\Models\Group;

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

    /**
     * Relationships
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Quiénes han leído este mensaje (Pivote message_reads)
    public function readBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'message_reads')
            ->withPivot('read_at');
    }
}
