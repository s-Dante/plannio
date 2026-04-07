<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'is_completed' => fake()->boolean(),
            'completed_at' => fake()->optional(0.5)->dateTimeBetween('-1 week', 'now'),
        ];
    }
}
