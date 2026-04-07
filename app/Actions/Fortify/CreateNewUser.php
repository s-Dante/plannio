<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $balls = [1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026];
        $randomBall = $balls[array_rand($balls)];

        return User::create([
            'name' => $input['name'],
            'father_lastname' => $input['father_lastname'],
            'mother_lastname' => $input['mother_lastname'] ?? null,
            'username' => $input['username'],
            'email' => $input['email'],
            'birthdate' => $input['birthdate'],
            'country' => $input['country'],
            'password' => $input['password'],
            'avatar' => "/imgs/assets/wc-balls/{$randomBall}.png",
        ]);
    }
}
