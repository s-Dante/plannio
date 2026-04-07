<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RewardFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'description' => fake()->sentence(),
            'points_required' => fake()->numberBetween(100, 5000),
            'type' => fake()->randomElement(\App\Enums\RewardTypeEnum::cases())->value,
            'image_url' => fake()->imageUrl(100, 100, 'business', true),
            'rarity' => fake()->randomElement(\App\Enums\RewardRarityEnum::cases())->value,
        ];
    }
}
