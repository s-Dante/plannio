<?php

namespace App\Enums;

use App\Traits\EnumHelper;

enum PlaceCategoryEnum: int
{
    use EnumHelper;

    case RESTAURANT = 1;
    case HOTEL = 2;
    case ATTRACTION = 3;
    case STADIUM = 4;
    case TRANSPORT = 5;
    case HOSPITAL = 6;
    case SHOP = 7;
    case PARK = 8;
    case MUSEUM = 9;
    case THEATER = 10;
    case SHOPPING_CENTER = 11;

    public function label(): string
    {
        return match($this) {
            self::RESTAURANT => 'Restaurante',
            self::HOTEL => 'Hotel',
            self::ATTRACTION => 'Atracción Turística',
            self::STADIUM => 'Estadio',
            self::TRANSPORT => 'Transporte',
            self::HOSPITAL => 'Hospital',
            self::SHOP => 'Comercio Local',
            self::PARK => 'Parque',
            self::MUSEUM => 'Museo',
            self::THEATER => 'Teatro',
            self::SHOPPING_CENTER => 'Centro Comercial',
        };
    }
}
