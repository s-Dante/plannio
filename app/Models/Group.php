<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

use App\Models\User;
use App\Models\Message;

class Group extends Model
{
    /** @use HasFactory<\Database\Factories\GroupFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'avatar',
        'is_individual',
        'is_encrypted',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_individual' => 'boolean',
            'is_encrypted' => 'boolean',
        ];
    }

    /**
     * Relations
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Miembros del grupo
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_users')
            ->withPivot('role', 'joined_at');
    }

    // Mensajes del grupo
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    // Relación optimizada para ver el último mensaje en la lista de chats
    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }
}
