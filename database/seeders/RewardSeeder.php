<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reward;

class RewardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Types:   1=BADGE, 2=FRAME
     * Rarity:  1=COMMON, 2=UNCOMMON, 3=RARE, 4=EPIC, 5=LEGENDARY
     */
    public function run(): void
    {
        $rewards = [
            // Badges
            [
                'name'            => 'Pionero',
                'description'     => 'Otorgado a los primeros usuarios de la plataforma.',
                'image_url'       => '🌟',
                'points_required' => 0,
                'type'            => 1,
                'rarity'          => 1,
            ],
            [
                'name'            => 'Aprendiz',
                'description'     => 'Has completado tus primeras tareas.',
                'image_url'       => '📚',
                'points_required' => 50,
                'type'            => 1,
                'rarity'          => 1,
            ],
            [
                'name'            => 'Comunicador',
                'description'     => 'Maestro de los chats.',
                'image_url'       => '💬',
                'points_required' => 100,
                'type'            => 1,
                'rarity'          => 3,
            ],
            [
                'name'            => 'Estratega',
                'description'     => 'Un genio de la productividad.',
                'image_url'       => '🧠',
                'points_required' => 500,
                'type'            => 1,
                'rarity'          => 4,
            ],
            [
                'name'            => 'Líder',
                'description'     => 'Lideras a tu equipo hacia el éxito.',
                'image_url'       => '👑',
                'points_required' => 1000,
                'type'            => 1,
                'rarity'          => 5,
            ],

            // Frames
            [
                'name'            => 'Cactus Planificador',
                'description'     => 'Este cactus te mantiene motivado.',
                'image_url'       => '/imgs/frames/Cactus.png',
                'points_required' => 150,
                'type'            => 2,
                'rarity'          => 1,
            ],
            [
                'name'            => 'Maracas Festivas',
                'description'     => 'Destaca en la multitud a puro ritmo.',
                'image_url'       => '/imgs/frames/Maracas.png',
                'points_required' => 400,
                'type'            => 2,
                'rarity'          => 3,
            ],
            [
                'name'            => 'Papel Picado',
                'description'     => 'Solo para los más dedicados y coloridos.',
                'image_url'       => '/imgs/frames/PapelPicado.png',
                'points_required' => 800,
                'type'            => 2,
                'rarity'          => 4,
            ],
            [
                'name'            => 'Sombrero Majestuoso',
                'description'     => 'Brilla en la oscuridad como un verdadero jefe.',
                'image_url'       => '/imgs/frames/Sombrero.png',
                'points_required' => 1500,
                'type'            => 2,
                'rarity'          => 5,
            ],
        ];

        foreach ($rewards as $reward) {
            Reward::updateOrCreate(['name' => $reward['name']], $reward);
        }
    }
}
