<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class IsbnValido implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $sanitized = preg_replace('/[-\s]/', '', (string) $value);
        if (!preg_match('/^(97(8|9))?\d{9}(\d|X)$/i', $sanitized)) {
            $fail('O campo :attribute informado não é um ISBN válido.');
        }
    }
}