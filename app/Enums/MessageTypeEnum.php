<?php

namespace App\Enums;

use App\Traits\EnumHelper;

enum MessageTypeEnum: int
{
    use EnumHelper;

    case TEXT = 1;
    case IMAGE = 2;
    case VIDEO = 3;
    case AUDIO = 4;
    case FILE = 5;
    case LOCATION = 6;
    case CONTACT = 7;
    case STICKER = 8;
    case LINK = 9;

    public function label(): string
    {
        return match($this) {
            self::TEXT => 'Texto',
            self::IMAGE => 'Imagen',
            self::VIDEO => 'Video',
            self::AUDIO => 'Audio',
            self::FILE => 'Archivo',
            self::LOCATION => 'Ubicación',
            self::CONTACT => 'Contacto',
            self::STICKER => 'Sticker',
            self::LINK => 'Enlace',
        };
    }
}
