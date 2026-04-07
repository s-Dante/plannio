<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CallParticipantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'joined_at' => fake()->dateTimeBetween('-1 month', '-1 day'),
            'left_at' => fake()->optional(0.8)->dateTimeBetween('-1 day', 'now'),
        ];
    }
}
