<?php

namespace App\Enums;

use App\Traits\EnumHelper;

enum TaskStatusEnum: int
{
    use EnumHelper;

    case TODO = 1;
    case IN_PROGRESS = 2;
    case DONE = 3;

    public function label(): string
    {
        return match ($this) {
            self::TODO => 'Por Hacer',
            self::IN_PROGRESS => 'En Progreso',
            self::DONE => 'Completada',
        };
    }
}
