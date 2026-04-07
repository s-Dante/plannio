<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskCompletition extends Model
{
    /** @use HasFactory<\Database\Factories\TaskCompletitionFactory> */
    use HasFactory;

    protected $fillable = [
        'task_id',
        'user_id',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
        ];
    }
}
