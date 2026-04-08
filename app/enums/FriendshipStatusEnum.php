<?php

namespace App\Enums;

use App\Traits\EnumHelper;

enum FriendshipStatusEnum: int
{
    use EnumHelper;

    case PENDING = 0;
    case ACCEPTED = 1;
    case REJECTED = 2;
    case BLOCKED = 3;

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pendiente',
            self::ACCEPTED => 'Aceptada',
            self::REJECTED => 'Rechazada',
            self::BLOCKED => 'Bloqueado',
        };
    }
}
