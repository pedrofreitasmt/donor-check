<?php

namespace App\Enums;

enum DocumentTypeEnum: string
{
    case RG = 'RG';
    case CNH = 'CNH';
    case CTPS = 'CTPS';

    public function label(): string
    {
        return match ($this) {
            self::RG => 'RG',
            self::CNH => 'CNH',
            self::CTPS => 'CTPS',
        };
    }
}
