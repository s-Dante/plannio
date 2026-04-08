<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;


use App\Models\Group;
use App\Models\Message;
use App\Models\Reward;
use App\Enums\FriendshipStatusEnum;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'father_lastname',
        'mother_lastname',
        'username',
        'email',
        'password',
        'avatar',
        'caption',
        'feeling_status',
        'accent_color',
        'birthdate',
        'country',
        'is_online',
        'last_seen_at',
        'points'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_online' => 'boolean',
            'birthdate' => 'date',
            'last_seen_at' => 'datetime',
            'points' => 'integer',
        ];
    }


    /**
     * Relationships
     */
    public function friends(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    // Grupos en los que participa
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'group_users')
            ->withPivot('role', 'joined_at', 'left_at');
    }

    // Mensajes que ha enviado
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    // Recompensas desbloqueadas
    public function unlockedRewards(): BelongsToMany
    {
        return $this->belongsToMany(Reward::class, 'user_unlocked_rewards')
            ->withPivot('is_equipped', 'unlocked_at');
    }

    public function sentFriendships(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    public function receivedFriendships(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'friend_id', 'user_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    public function getFriendsAttribute()
    {
        $sent = $this->sentFriendships()->wherePivot('status', FriendshipStatusEnum::ACCEPTED->value)->get();
        $received = $this->receivedFriendships()->wherePivot('status', FriendshipStatusEnum::ACCEPTED->value)->get();

        return $sent->merge($received);
    }

    public function isFriendsWith(User $user)
    {
        return (bool) $this->friends->where('id', $user->id)->count();
    }

    public function pendingFriendRequests()
    {
        return $this->receivedFriendships()->wherePivot('status', FriendshipStatusEnum::PENDING->value);
    }

    /**
     * Logica
     */
    public function addPoints($amount, $reason = null)
    {
        $this->increment('points', $amount);

        // Verificar si desbloqueó nuevas recompensas
        $newRewards = Reward::where('required_points', '<=', $this->points)
            ->whereNotIn('id', $this->unlockedRewards()->pluck('rewards.id'))
            ->get();

        foreach ($newRewards as $reward) {
            $this->unlockedRewards()->attach($reward->id);
        }

        return $newRewards;
    }

    public function isOnline()
    {
        return $this->is_online;
    }

    public function setOnlineStatus($status)
    {
        $this->is_online = $status;
        $this->last_seen_at = now();
        $this->save();

        // Broadcast cambio de estado
        
    }
}
