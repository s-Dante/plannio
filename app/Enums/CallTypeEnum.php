<?php

namespace App\Enums;

use App\Traits\EnumHelper;

enum CallTypeEnum: int
{
    use EnumHelper;

    case VOICE = 1;
    case VIDEO = 2;

    public function label(): string
    {
        return match($this) {
            self::VOICE => 'Voz',
            self::VIDEO => 'Video',
        };
    }
}
