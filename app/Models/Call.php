<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use App\Models\User;
use App\Models\Group;

use App\Enums\CallStatusEnum;

class Call extends Model
{
    /** @use HasFactory<\Database\Factories\CallFactory> */
    use HasFactory;

    protected $fillable = [
        'group_id',
        'caller_id',
        'status',
        'started_at',
        'ended_at',
        'duration',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'duration' => 'integer',
            'status' => CallStatusEnum::class,
        ];
    }

    /**
     * Relationships
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function caller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'caller_id');
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'call_participants')
            ->withPivot('joined_at', 'left_at');
    }
}
