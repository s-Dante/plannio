<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Enums\RewardTypeEnum;
use App\Enums\RewardRarityEnum;
class Reward extends Model
{
    /** @use HasFactory<\Database\Factories\RewardFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'points_required',
        'type',
        'image_url',
        'rarity',
    ];

    protected function casts(): array
    {
        return [
            'type' => RewardTypeEnum::class,
            'rarity' => RewardRarityEnum::class,
        ];
    }
}
