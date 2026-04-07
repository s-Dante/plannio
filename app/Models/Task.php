<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Models\User;
use App\Models\Group;
use App\Models\TaskCompletition;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    protected $fillable = [
        'group_id',
        'user_id',
        'title',
        'description',
        'is_completed',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Relationships
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    // Usuario asignado a esta tarea
    public function completedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_completions')->withPivot('completed_at');
    }

    public function completions(): HasMany
    {
        return $this->hasMany(TaskCompletition::class);
    }

    /**
     * Logica
     */
    public function markCompletedBy($userId)
    {
        // Crear registro de completación
        TaskCompletition::firstOrCreate([
            'task_id' => $this->id,
            'user_id' => $userId
        ]);

        // Verificar si todos completaron
        $totalMembers = $this->group->users()->count();
        $completedCount = $this->completions()->count();

        if ($completedCount >= $totalMembers && !$this->is_completed) {
            $this->is_completed = true;
            $this->completed_at = now();
            $this->save();

            // EVENTO: Disparar evento de Reverb
            //broadcast(new TaskCompletition($this));

            // RECOMPENSAS: Dar puntos a todos
            $this->group->users->each(function ($user) {
                $user->addPoints(rand(10, 50), 'Tarea completada');
            });
        }
    }
}
