<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaceRating extends Model
{
    /** @use HasFactory<\Database\Factories\PlaceRatingFactory> */
    use HasFactory;

    protected $fillable = [
        'place_id',
        'user_id',
        'rating',
        'comment',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
        ];
    }
}
