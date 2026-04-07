<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Models\User;
use App\Models\PlaceRating;

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

    /**
     * Relationships
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(PlaceRating::class);
    }

    /**
     * Logica
     */
    public function rateByUser($userId, $rating, $comment = null)
    {
        PlaceRating::updateOrCreate(
            ['place_id' => $this->id, 'user_id' => $userId],
            ['rating' => $rating, 'comment' => $comment]
        );

        $this->recalculateRating();
    }

    protected function recalculateRating()
    {
        $this->average_rating = $this->ratings()->avg('rating');
        $this->total_ratings = $this->ratings()->count();
        $this->save();
    }

    //  SCOPES 
    public function scopeNearby($query, $lat, $lng, $radiusKm = 10)
    {
        // Fórmula Haversine para buscar lugares cercanos
        $query->selectRaw("
            places.*,
            (6371 * acos(cos(radians(?)) * cos(radians(latitude)) 
            * cos(radians(longitude) - radians(?)) 
            + sin(radians(?)) * sin(radians(latitude)))) AS distance
        ", [$lat, $lng, $lat])
            ->having('distance', '<', $radiusKm)
            ->orderBy('distance');
    }
}
