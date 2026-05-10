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
use App\Enums\TaskStatusEnum;
use App\Enums\TaskPriorityEnum;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    protected $fillable = [
        'group_id',
        'user_id',
        'title',
        'description',
        'status',
        'priority',
        'start_date',
        'due_date',
        'is_completed',
        'points_reward',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => TaskStatusEnum::class,
            'priority' => TaskPriorityEnum::class,
            'start_date' => 'datetime',
            'due_date' => 'datetime',
            'is_completed' => 'boolean',
            'points_reward' => 'integer',
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
        TaskCompletition::firstOrCreate([
            'task_id' => $this->id,
            'user_id' => $userId
        ]);

        if ($this->group_id) {
            // Tarea de Grupo: Verificar si todos los miembros completaron
            $totalMembers = $this->group->members()->count();
            $completedCount = $this->completions()->count();

            if ($completedCount >= $totalMembers && !$this->is_completed) {
                $this->status = TaskStatusEnum::DONE;
                $this->is_completed = true;
                $this->completed_at = now();
                $this->points_reward = rand(15, 60);
                $this->save();

                // RECOMPENSAS: Dar puntos a todos los miembros del grupo
                $this->group->members->each(function ($user) {
                    $user->addPoints($this->points_reward, 'Tarea completada grupal');
                });
            }
        } else {
            // Tarea Personal: Se completa de inmediato
            if (!$this->is_completed) {
                $this->status = TaskStatusEnum::DONE;
                $this->is_completed = true;
                $this->completed_at = now();
                $this->points_reward = rand(10, 30);
                $this->save();
                
                $user = User::find($userId);
                if ($user) {
                    $user->addPoints($this->points_reward, 'Tarea completada personal');
                }
            }
        }
    }
}
