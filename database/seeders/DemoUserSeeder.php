<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DemoUserSeeder extends Seeder
{
    /**
     * Crea 3 usuarios de demostración con credenciales conocidas.
     * Corre en producción para que el equipo pueda probar la app.
     */
    public function run(): void
    {
        $users = [
            [
                'name'            => 'Prueba',
                'father_lastname' => 'Uno',
                'mother_lastname' => 'Demo',
                'username'        => 'prueba1',
                'email'           => 'prueba1@plannio.com',
                'birthdate'       => '2000-01-01',
                'points'          => 0,
            ],
            [
                'name'            => 'Prueba',
                'father_lastname' => 'Dos',
                'mother_lastname' => 'Demo',
                'username'        => 'prueba2',
                'email'           => 'prueba2@plannio.com',
                'birthdate'       => '2000-02-02',
                'points'          => 0,
            ],
            [
                'name'            => 'Prueba',
                'father_lastname' => 'Tres',
                'mother_lastname' => 'Demo',
                'username'        => 'prueba3',
                'email'           => 'prueba3@plannio.com',
                'birthdate'       => '2000-03-03',
                'points'          => 0,
            ],
        ];

        foreach ($users as $data) {
            User::updateOrCreate(
                ['email' => $data['email']],
                array_merge($data, [
                    'password'          => Hash::make('Pswd4321_'),
                    'email_verified_at' => now(),
                ])
            );
        }
    }
}
