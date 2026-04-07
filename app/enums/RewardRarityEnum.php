<?php

namespace App\Enums;

enum RewardRarityEnum: int
{
    case COMMON = 1;
    case UNCOMMON = 2;
    case RARE = 3;
    case EPIC = 4;
    case LEGENDARY = 5;
}
