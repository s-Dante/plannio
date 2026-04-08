<?php

namespace App\Traits;

trait EnumHelper
{
    /**
     * Get associative array of all enum values with their labels
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
     * Get label dynamically given a value
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
