<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $venues = [
            [
                'name' => 'Parque Fundidora',
                'description' => 'Un extenso parque público e histótico ubicado en los terrenos de la antigua compañía Fundidora de Fierro y Acero de Monterrey.',
                'latitude' => 25.6791,
                'longitude' => -100.2858,
                'category' => 1,
                'is_official_venue' => true,
            ],
            [
                'name' => 'Macroplaza',
                'description' => 'Una de las plazas más grandes del mundo, uniendo el norte con el sur en el centro de Monterrey, con museos y monumentos históricos.',
                'latitude' => 25.6698,
                'longitude' => -100.3090,
                'category' => 2,
                'is_official_venue' => true,
            ],
            [
                'name' => 'Paseo Santa Lucía',
                'description' => 'Canal de agua artificial navegable, excelente para caminar de día y noche.',
                'latitude' => 25.6738,
                'longitude' => -100.2974,
                'category' => 1,
                'is_official_venue' => true,
            ],
            [
                'name' => 'Estadio BBVA',
                'description' => 'Estadio de futbol hogar de los Rayados del Monterrey, conocido como el Gigante de Acero.',
                'latitude' => 25.6692,
                'longitude' => -100.2443,
                'category' => 3,
                'is_official_venue' => true,
            ],
            [
                'name' => 'Cerro de la Silla',
                'description' => 'Montaña con cuatro picos que domina la ciudad de Monterrey y forma parte del sistema de la Sierra Madre Oriental.',
                'latitude' => 25.6174,
                'longitude' => -100.2372,
                'category' => 1,
                'is_official_venue' => true,
            ],
        ];

        // Seeder user 1 fallback
        $firstUser = \App\Models\User::first();
        $fallbackId = $firstUser ? $firstUser->id : \App\Models\User::factory()->create()->id;

        foreach ($venues as $venue) {
            \App\Models\Place::firstOrCreate(
                ['name' => $venue['name']],
                array_merge($venue, [
                    'created_by' => $fallbackId,
                    'average_rating' => 0.00,
                    'ratings_count' => 0,
                ])
            );
        }
    }
}
