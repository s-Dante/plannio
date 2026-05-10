<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Enums\FriendshipStatusEnum;

class FriendFactory extends Factory
{
    public function definition(): array
    {
        return [
            'status' => fake()->randomElement(FriendshipStatusEnum::cases())->value,
        ];
    }
}
