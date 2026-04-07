<?php

namespace App\Enums;

enum CallStatusEnum: int
{
    case INITIATED = 0;
    case ONGOING = 1;
    case ENDED = 2;
    case MISSED = 3;
    case REJECTED = 4;
}
