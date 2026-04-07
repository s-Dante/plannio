<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(\App\Enums\MessageTypeEnum::cases())->value,
            'content' => fake()->text(),
            'media_url' => fake()->optional(0.3)->imageUrl(),
            'mime_type' => fake()->optional(0.3)->mimeType(),
            'file_size' => fake()->optional(0.3)->numberBetween(1024, 10485760),
            'latitude' => fake()->optional(0.1)->latitude(),
            'longitude' => fake()->optional(0.1)->longitude(),
            'is_encrypted' => fake()->boolean(),
        ];
    }
}
