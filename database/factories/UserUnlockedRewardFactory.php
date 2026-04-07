<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UserUnlockedRewardFactory extends Factory
{
    public function definition(): array
    {
        return [
            'unlocked_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'is_active' => fake()->boolean(),
        ];
    }
}
