<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GroupFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'description' => fake()->sentence(),
            'avatar' => fake()->imageUrl(200, 200, 'abstract', true),
            'is_individual' => fake()->boolean(20),
            'is_encrypted' => fake()->boolean(80),
        ];
    }
}
