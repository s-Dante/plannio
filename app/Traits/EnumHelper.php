<?php

namespace App\Traits;

trait EnumHelper
{
    /**
     * Obtenemos todos los valores del anum junto con su label para usarlo en front
     */
    public static function getOptions(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[] = [
                'value' => $case->value ?? $case->name,
                'label' => method_exists($case, 'label') ? $case->label() : $case->name,
            ];
        }
        return $options;
    }

    /**
     * Obtener el label de un enum dado su valor
     */
    public static function fetchLabel(string|int $value): string
    {
        $case = self::tryFrom($value);
        if (!$case) {
            return (string)$value;
        }

        return method_exists($case, 'label') ? $case->label() : $case->name;
    }
}
