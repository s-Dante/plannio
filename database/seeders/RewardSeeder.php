<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Enums\RewardTypeEnum;
use App\Enums\RewardRarityEnum;
use App\Models\Reward;

class RewardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rewards = [
            // Badges
            [
                'name' => 'Pionero',
                'description' => 'Otorgado a los primeros usuarios de la plataforma.',
                'image_url' => 'https://api.dicebear.com/7.x/icons/svg?seed=Pionero&backgroundColor=ffdfbf',
                'points_required' => 0,
                'type' => RewardTypeEnum::BADGE->value,
                'rarity' => RewardRarityEnum::COMMON->value,
            ],
            [
                'name' => 'Aprendiz',
                'description' => 'Has completado tus primeras tareas.',
                'image_url' => 'https://api.dicebear.com/7.x/icons/svg?seed=Aprendiz&backgroundColor=b6e3f4',
                'points_required' => 50,
                'type' => RewardTypeEnum::BADGE->value,
                'rarity' => RewardRarityEnum::COMMON->value,
            ],
            [
                'name' => 'Comunicador',
                'description' => 'Maestro de los chats.',
                'image_url' => 'https://api.dicebear.com/7.x/icons/svg?seed=Chat&backgroundColor=c0aede',
                'points_required' => 100,
                'type' => RewardTypeEnum::BADGE->value,
                'rarity' => RewardRarityEnum::RARE->value,
            ],
            [
                'name' => 'Estratega',
                'description' => 'Un genio de la productividad.',
                'image_url' => 'https://api.dicebear.com/7.x/icons/svg?seed=Estrategia&backgroundColor=ffd5dc',
                'points_required' => 500,
                'type' => RewardTypeEnum::BADGE->value,
                'rarity' => RewardRarityEnum::EPIC->value,
            ],
            [
                'name' => 'Líder',
                'description' => 'Lideras a tu equipo hacia el éxito.',
                'image_url' => 'https://api.dicebear.com/7.x/icons/svg?seed=Lider&backgroundColor=d1d4f9',
                'points_required' => 1000,
                'type' => RewardTypeEnum::BADGE->value,
                'rarity' => RewardRarityEnum::LEGENDARY->value,
            ],

            // Frames
            [
                'name' => 'Cactus Planificador',
                'description' => 'Este cactus te mantiene motivado.',
                'image_url' => '/imgs/frames/Cactus.png',
                'points_required' => 150,
                'type' => RewardTypeEnum::FRAME->value,
                'rarity' => RewardRarityEnum::COMMON->value,
            ],
            [
                'name' => 'Maracas Festivas',
                'description' => 'Destaca en la multitud a puro ritmo.',
                'image_url' => '/imgs/frames/Maracas.png',
                'points_required' => 400,
                'type' => RewardTypeEnum::FRAME->value,
                'rarity' => RewardRarityEnum::RARE->value,
            ],
            [
                'name' => 'Papel Picado',
                'description' => 'Solo para los más dedicados y coloridos.',
                'image_url' => '/imgs/frames/PapelPicado.png',
                'points_required' => 800,
                'type' => RewardTypeEnum::FRAME->value,
                'rarity' => RewardRarityEnum::EPIC->value,
            ],
            [
                'name' => 'Sombrero Majestuoso',
                'description' => 'Brilla en la oscuridad como un verdadero jefe.',
                'image_url' => '/imgs/frames/Sombrero.png',
                'points_required' => 1500,
                'type' => RewardTypeEnum::FRAME->value,
                'rarity' => RewardRarityEnum::LEGENDARY->value,
            ],
        ];

        foreach ($rewards as $reward) {
            Reward::firstOrCreate(['name' => $reward['name']], $reward);
        }
    }
}
