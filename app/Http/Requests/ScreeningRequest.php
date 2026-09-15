<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScreeningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'donor_id' => ['required', 'integer', 'exists:donors,id'],
            'sleep_hours_last_24h' => ['required', 'integer', 'min:0', 'max:24'],
            'fatty_food_last_4h' => ['boolean'],
            'alcohol_last_12h' => ['boolean'],
            'cold_symptoms_end_date' => ['nullable', 'date', 'before_or_equal:today'],
            'last_tattoo_date' => ['nullable', 'date', 'before_or_equal:today'],
            'std_risk_date' => ['nullable', 'date', 'before_or_equal:today'],
            'last_endoscopy_date' => ['nullable', 'date', 'before_or_equal:today'],
            'dental_procedure_date' => ['nullable', 'date', 'before_or_equal:today'],
            'dental_procedure_type' => ['required_with:dental_procedure_date', 'nullable', 'string', 'in:extração,canal'],
            'is_pregnant' => ['boolean'],
            'delivery_date' => ['nullable', 'date', 'before_or_equal:today'],
            'delivery_type' => ['required_with:delivery_date', 'nullable', 'string', 'in:normal,cesariana'],
            'is_breastfeeding' => ['boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'donor_id' => 'Doador',
            'sleep_hours_last_24h' => 'Horas de sono nas últimas 24h',
            'fatty_food_last_4h' => 'Comida gordurosa nas últimas 4h',
            'alcohol_last_12h' => 'Álcool nas últimas 12h',
            'cold_symptoms_end_date' => 'Data fim dos sintomas de resfriado',
            'last_tattoo_date' => 'Data da última tatuagem',
            'std_risk_date' => 'Data do último risco de DST',
            'last_endoscopy_date' => 'Data da última endoscopia',
            'dental_procedure_date' => 'Data do procedimento dentário',
            'dental_procedure_type' => 'Tipo de procedimento dentário',
            'is_pregnant' => 'Está grávida?',
            'delivery_date' => 'Data do parto',
            'delivery_type' => 'Tipo de parto',
            'is_breastfeeding' => 'Está amamentando?',
        ];
    }
}
