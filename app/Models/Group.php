<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
