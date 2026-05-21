<?php

namespace App\Enums;

use App\Traits\EnumHelper;

enum TaskPriorityEnum: int
{
    use EnumHelper;

    case LOW = 1;
    case MEDIUM = 2;
    case HIGH = 3;
    case URGENT = 4;

    public function label(): string
    {
        return match ($this) {
            self::LOW => 'Baja',
            self::MEDIUM => 'Media',
            self::HIGH => 'Alta',
            self::URGENT => 'Urgente',
        };
    }
}
