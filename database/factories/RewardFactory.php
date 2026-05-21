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
            'type' => fake()->randomElement([1, 2]), // 1=BADGE, 2=FRAME
            'image_url' => fake()->imageUrl(100, 100, 'business', true),
            'rarity' => fake()->randomElement([1, 2, 3, 4, 5]), // 1=COMMON, 2=UNCOMMON, 3=RARE, 4=EPIC, 5=LEGENDARY
        ];
    }
}
