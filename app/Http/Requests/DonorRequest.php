<?php

namespace App\Http\Requests;

use App\Enums\DocumentTypeEnum;
use App\Enums\GenderEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DonorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date', 'before:today'],
            'gender' => ['required', Rule::enum(GenderEnum::class)],
            'weight' => ['required', 'numeric', 'min:50'],
            'document_type' => ['required', Rule::enum(DocumentTypeEnum::class)],
            'document_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('donors', 'document_number')->ignore($this->route('donor')),
            ],
            'first_donation_date' => ['nullable', 'date', 'before_or_equal:today'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Nome Completo',
            'birth_date' => 'Data de Nascimento',
            'gender' => 'Gênero',
            'weight' => 'Peso',
            'document_type' => 'Tipo de Documento',
            'document_number' => 'Número do Documento',
            'first_donation_date' => 'Data da Primeira Doação',
        ];
    }
}
