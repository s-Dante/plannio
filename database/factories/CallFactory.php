<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CallFactory extends Factory
{
    public function definition(): array
    {
        return [
            'status' => fake()->randomElement([0, 1, 2, 3, 4]), // 0=INITIATED, 1=ONGOING, 2=ENDED, 3=MISSED, 4=REJECTED
            'started_at' => fake()->dateTimeBetween('-1 month', '-1 day'),
            'ended_at' => fake()->optional(0.8)->dateTimeBetween('-1 day', 'now'),
            'duration' => fake()->numberBetween(10, 3600),
        ];
    }
}
