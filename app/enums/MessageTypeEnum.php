<?php

namespace App\Enums;

enum MessageTypeEnum: int
{
    case TEXT = 1;
    case IMAGE = 2;
    case VIDEO = 3;
    case AUDIO = 4;
    case FILE = 5;
    case LOCATION = 6;
    case CONTACT = 7;
    case STICKER = 8;
    case LINK = 9;
}
