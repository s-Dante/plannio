<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PlaceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'description' => fake()->text(200),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'category' => fake()->numberBetween(1, 10),
            'is_official_venue' => fake()->boolean(10),
            'average_rating' => fake()->randomFloat(1, 1, 5),
            'ratings_count' => fake()->numberBetween(0, 100),
        ];
    }
}
