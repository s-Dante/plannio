<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GroupUserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'role' => fake()->randomElement([1, 2]),
            'joined_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'left_at' => fake()->optional(0.1)->dateTimeBetween('-1 week', 'now'),
        ];
    }
}
