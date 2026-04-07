<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FriendFactory extends Factory
{
    public function definition(): array
    {
        return [
            'status' => fake()->randomElement(\App\Enums\FriendshipStatusEnum::cases())->value,
        ];
    }
}
