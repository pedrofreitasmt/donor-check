<?php

namespace App\Services;

use App\Http\Requests\DonorRequest;
use App\Models\Donor;
use App\Support\Result;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class DonorService extends Service
{
    public function listDonors(Request $request): LengthAwarePaginator
    {
        $query = Donor::query()->latest('id');

        $this->filter($query, $request);

        return $query->paginate(10)->withQueryString();
    }

    public function storeDonor(DonorRequest $request): Result
    {
        try {
            Donor::create($request->validated());
            
            return Result::success();
        } catch (\Throwable $th) {
            Log::error('Falha ao tentar salvar doador.', [
                'message' => $th->getMessage(),
                'trace' => $th->getTraceAsString(),
            ]);

            return Result::failure('Falha ao tentar salvar doador. Tente novamente mais tarde.');
        }
    }

    public function updateDonor(DonorRequest $request, Donor $donor): Result
    {
        try {
            $donor->update($request->validated());

            return Result::success();
        } catch (\Throwable $th) {
            Log::error('Falha ao tentar atualizar doador.', [
                'message' => $th->getMessage(),
                'trace' => $th->getTraceAsString(),
            ]);

            return Result::failure('Falha ao tentar atualizar doador. Tente novamente mais tarde.');
        }
    }

    public function destroyDonor(Donor $donor): Result
    {
        if ($donor->screenings()->exists()) {
            return Result::failure('Não é possível excluir um doador que possui coletas cadastradas.');
        }

        try {
            $donor->delete();

            return Result::success();
        } catch (\Throwable $th) {
            Log::error('Falha ao tentar excluir doador.', [
                'message' => $th->getMessage(),
                'trace' => $th->getTraceAsString(),
            ]);

            return Result::failure('Falha ao tentar excluir doador. Tente novamente mais tarde.');
        }
    }
}
