<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MessageReadFactory extends Factory
{
    public function definition(): array
    {
        return [
            'read_at' => fake()->dateTimeBetween('-2 days', 'now'),
        ];
    }
}
