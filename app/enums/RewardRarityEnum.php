<?php

namespace App\Enums;

use App\Traits\EnumHelper;

enum RewardRarityEnum: int
{
    use EnumHelper;

    case COMMON = 1;
    case UNCOMMON = 2;
    case RARE = 3;
    case EPIC = 4;
    case LEGENDARY = 5;

    public function label(): string
    {
        return match($this) {
            self::COMMON => 'Común',
            self::UNCOMMON => 'Poco Común',
            self::RARE => 'Raro',
            self::EPIC => 'Épico',
            self::LEGENDARY => 'Legendario',
        };
    }
}
