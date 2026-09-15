<?php

namespace App\Models;

use App\Enums\DocumentTypeEnum;
use App\Enums\GenderEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Donor extends Model
{
    protected $fillable = [
        'name',
        'birth_date',
        'gender',
        'weight',
        'document_type',
        'document_number',
        'first_donation_date',
    ];

    public array $filterable = ['name', 'document_number'];

    protected $casts = [
        'gender' => GenderEnum::class,
        'document_type' => DocumentTypeEnum::class,
        'birth_date' => 'date',
        'first_donation_date' => 'date',
        'weight' => 'decimal:2',
    ];

    public function screenings(): HasMany
    {
        return $this->hasMany(Screening::class);
    }
}
