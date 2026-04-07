<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->firstName(),
            'father_lastname' => fake()->lastName(),
            'mother_lastname' => fake()->lastName(),
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
            'avatar' => fake()->imageUrl(200, 200, 'people', true),
            'caption' => fake()->sentence(3),
            'feeling_status' => fake()->randomElement(['happy', 'sad', 'excited', 'tired']),
            'accent_color' => fake()->hexColor(),
            'birthdate' => fake()->dateTimeBetween('-40 years', '-18 years')->format('Y-m-d'),
            'country' => fake()->countryCode(),
            'is_online' => fake()->boolean(20),
            'last_seen_at' => fake()->dateTimeBetween('-1 week', 'now'),
            'points' => fake()->numberBetween(0, 5000),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
