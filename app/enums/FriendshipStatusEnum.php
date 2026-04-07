<?php

namespace App\Enums;

enum FriendshipStatusEnum: int
{
    case PENDING = 0;
    case ACCEPTED = 1;
    case REJECTED = 2;
    case BLOCKED = 3;
}
