<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    /** @use HasFactory<\Database\Factories\PlaceFactory> */
    use HasFactory;

    protected $fillable = [
        'created_by',
        'name',
        'description',
        'latitude',
        'longitude',
        'category',
        'is_official_venue',
        'average_rating',
        'ratings_count',
    ];

    public function casts(): array
    {
        return [
            'created_by' => 'integer',
            'name' => 'string',
            'description' => 'string',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'category' => 'integer',
            'is_official_venue' => 'boolean',
            'average_rating' => 'decimal:2',
            'ratings_count' => 'integer',
        ];
    }
}
