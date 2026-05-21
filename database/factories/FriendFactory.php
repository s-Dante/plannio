<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FriendFactory extends Factory
{
    public function definition(): array
    {
        return [
            'status' => fake()->randomElement([0, 1, 2, 3]), // 0=PENDING, 1=ACCEPTED, 2=REJECTED, 3=BLOCKED
        ];
    }
}
