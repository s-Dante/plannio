<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TaskCompletitionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'completed_at' => fake()->dateTimeBetween('-1 week', 'now'),
        ];
    }
}
