<?php

namespace App\Enums;

use App\Traits\EnumHelper;

enum CallStatusEnum: int
{
    use EnumHelper;

    case INITIATED = 0;
    case ONGOING = 1;
    case ENDED = 2;
    case MISSED = 3;
    case REJECTED = 4;

    public function label(): string
    {
        return match($this) {
            self::INITIATED => 'Iniciada',
            self::ONGOING => 'En Curso',
            self::ENDED => 'Finalizada',
            self::MISSED => 'Perdida',
            self::REJECTED => 'Rechazada',
        };
    }
}
