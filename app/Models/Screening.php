<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Screening extends Model
{
    protected $fillable = [
        'donor_id',
        'sleep_hours_last_24h',
        'fatty_food_last_4h',
        'alcohol_last_12h',
        'cold_symptoms_end_date',
        'last_tattoo_date',
        'std_risk_date',
        'last_endoscopy_date',
        'dental_procedure_date',
        'dental_procedure_type',
        'is_pregnant',
        'delivery_date',
        'delivery_type',
        'is_breastfeeding',
        'is_apt',
        'rejection_reasons',
    ];

    protected $casts = [
        'fatty_food_last_4h' => 'boolean',
        'alcohol_last_12h' => 'boolean',
        'cold_symptoms_end_date' => 'date',
        'last_tattoo_date' => 'date',
        'std_risk_date' => 'date',
        'last_endoscopy_date' => 'date',
        'dental_procedure_date' => 'date',
        'is_pregnant' => 'boolean',
        'delivery_date' => 'date',
        'is_breastfeeding' => 'boolean',
        'is_apt' => 'boolean',
        'rejection_reasons' => 'array',
    ];

    public function donor(): BelongsTo
    {
        return $this->belongsTo(Donor::class);
    }
}
