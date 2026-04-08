<?php

namespace App\Enums;

use App\Traits\EnumHelper;

enum RewardTypeEnum: int
{
    use EnumHelper;

    case BADGE = 1;
    case FRAME = 2;
    case THEME = 3;
    case CHAT_BACKGROUND = 4;

    public function label(): string
    {
        return match($this) {
            self::BADGE => 'Insignia',
            self::FRAME => 'Marco',
            self::THEME => 'Tema',
            self::CHAT_BACKGROUND => 'Fondo de Chat',
        };
    }
}
