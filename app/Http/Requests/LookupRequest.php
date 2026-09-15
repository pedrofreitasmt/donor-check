<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\In;

class LookupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $allowedSources = array_keys(config('lookup_sources.sources', []));

        return [
            'source' => [
                'required',
                'string',
                new In($allowedSources),
            ],

            'search' => [
                'nullable',
                'string',
                'max:100',
            ],

            'cascade' => [
                'nullable',
                'string', // Aceita ID, ULID ou UUID do elemento pai
            ],

            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ];
    }
}