<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GroupFactory extends Factory
{
    public function definition(): array
    {
        $logos = [1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026];
        $randomLogo = $logos[array_rand($logos)];

        return [
            'name' => fake()->company(),
            'description' => fake()->sentence(),
            'avatar' => "/imgs/assets/wc-fifa-logos/{$randomLogo}.png",
            'is_individual' => fake()->boolean(20),
            'is_encrypted' => fake()->boolean(80),
        ];
    }
}
