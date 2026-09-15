<?php

namespace App\Services;

use App\Http\Requests\ScreeningRequest;
use App\Models\Donor;
use App\Models\Screening;
use App\Support\Result;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class ScreeningService extends Service
{
    public function listScreenings(Request $request): LengthAwarePaginator
    {
        $query = Screening::with('donor')->latest('id');

        $this->filter($query, $request);

        return $query->paginate(10)->withQueryString();
    }

    public function storeScreening(ScreeningRequest $request): Result
    {
        try {
            $data = $request->validated();
            $reasons = [];
            $now = now();
            
            // Avaliação do Doador (Requisitos Básicos)
            $donor = Donor::find($data['donor_id']);

            if ($donor) {
                // Idade
                $age = $donor->birth_date ? \Carbon\Carbon::parse($donor->birth_date)->age : 0;
                if ($age < 16 || $age > 69) {
                    $reasons[] = 'Idade fora da faixa permitida (16 a 69 anos).';
                }
                
                if ($age > 60) {
                    $firstDonationAge = $donor->first_donation_date 
                        ? \Carbon\Carbon::parse($donor->birth_date)->diffInYears($donor->first_donation_date)
                        : $age;
                        
                    if ($firstDonationAge >= 60) {
                        $reasons[] = 'Primeira doação após os 60 anos não é permitida.';
                    }
                }
                
                // Peso
                if ($donor->weight < 50) {
                    $reasons[] = 'Peso inferior a 50kg.';
                }
            }
            
            // Requisitos Básicos (Triagem)
            if ($data['sleep_hours_last_24h'] < 6) {
                $reasons[] = 'Horas de sono insuficientes (mínimo 6 horas).';
            }
            if (!empty($data['fatty_food_last_4h']) && $data['fatty_food_last_4h']) {
                $reasons[] = 'Ingestão de comida gordurosa nas últimas 4 horas.';
            }
            if (!empty($data['alcohol_last_12h']) && $data['alcohol_last_12h']) {
                $reasons[] = 'Ingestão de bebida alcoólica nas últimas 12 horas.';
            }
            
            // Impedimentos Temporários
            if (!empty($data['cold_symptoms_end_date'])) {
                if (\Carbon\Carbon::parse($data['cold_symptoms_end_date'])->diffInDays($now) < 7) {
                    $reasons[] = 'Resfriado: necessário aguardar 7 dias após os sintomas.';
                }
            }
            
            if (!empty($data['last_tattoo_date'])) {
                if (\Carbon\Carbon::parse($data['last_tattoo_date'])->diffInMonths($now) < 12) {
                    $reasons[] = 'Tatuagem recente: necessário aguardar 12 meses.';
                }
            }
            
            if (!empty($data['std_risk_date'])) {
                if (\Carbon\Carbon::parse($data['std_risk_date'])->diffInMonths($now) < 12) {
                    $reasons[] = 'Risco DST: necessário aguardar 12 meses.';
                }
            }
            
            if (!empty($data['last_endoscopy_date'])) {
                if (\Carbon\Carbon::parse($data['last_endoscopy_date'])->diffInMonths($now) < 6) {
                    $reasons[] = 'Endoscopia recente: necessário aguardar 6 meses.';
                }
            }
            
            if (!empty($data['dental_procedure_date'])) {
                if (\Carbon\Carbon::parse($data['dental_procedure_date'])->diffInDays($now) < 7) {
                    $reasons[] = 'Procedimento dentário: necessário aguardar 7 dias.';
                }
            }
            
            // Mulheres
            if (!empty($data['is_pregnant']) && $data['is_pregnant']) {
                $reasons[] = 'Gestação impede a doação.';
            }
            
            if (!empty($data['delivery_date'])) {
                $deliveryMonths = \Carbon\Carbon::parse($data['delivery_date'])->diffInMonths($now);
                $deliveryDays = \Carbon\Carbon::parse($data['delivery_date'])->diffInDays($now);
                $type = $data['delivery_type'] ?? null;
                
                if ($type === 'normal' && $deliveryDays < 90) {
                    $reasons[] = 'Parto normal recente (aguardar 90 dias).';
                }
                
                if ($type === 'cesariana' && $deliveryDays < 180) {
                    $reasons[] = 'Cesariana recente (aguardar 180 dias).';
                }
                
                if (!empty($data['is_breastfeeding']) && $data['is_breastfeeding'] && $deliveryMonths < 12) {
                    $reasons[] = 'Amamentação: parto ocorreu há menos de 12 meses.';
                }
            }
            
            $data['is_apt'] = empty($reasons);
            $data['rejection_reasons'] = $reasons;

            Screening::create($data);

            return Result::success();
        } catch (\Throwable $th) {
            Log::error('Falha ao tentar salvar triagem.', [
                'message' => $th->getMessage(),
                'trace' => $th->getTraceAsString(),
            ]);

            return Result::failure('Falha ao tentar salvar triagem. Tente novamente mais tarde.');
        }
    }
}