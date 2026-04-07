<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CallFactory extends Factory
{
    public function definition(): array
    {
        return [
            'status' => fake()->randomElement(\App\Enums\CallStatusEnum::cases())->value,
            'started_at' => fake()->dateTimeBetween('-1 month', '-1 day'),
            'ended_at' => fake()->optional(0.8)->dateTimeBetween('-1 day', 'now'),
            'duration' => fake()->numberBetween(10, 3600),
        ];
    }
}
