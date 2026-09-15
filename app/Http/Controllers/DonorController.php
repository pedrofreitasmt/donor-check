<?php

namespace App\Http\Controllers;

use App\Http\Requests\DonorRequest;
use App\Models\Donor;
use App\Services\DonorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class DonorController extends Controller
{
    public function __construct(private DonorService $donorService) {}

    public function index(Request $request): Response
    {
        $donors = $this->donorService->listDonors($request);

        return inertia('Donor/Index', [
            'donors' => $donors,
            'filters' => $request->query(),
        ]);
    }

    public function create(): Response
    {
        return inertia('Donor/Create');
    }

    public function store(DonorRequest $request): RedirectResponse
    {
        $result = $this->donorService->storeDonor($request);

        if ($result->isFailure()) {
            return $this->redirectBackWithResult($result);
        }

        return redirect()->route('donors.index')->with('success', 'Doador cadastrado com sucesso!');
    }

    public function edit(Donor $donor): Response
    {
        return inertia('Donor/Edit', compact('donor'));
    }

    public function update(DonorRequest $request, Donor $donor): RedirectResponse
    {
        $result = $this->donorService->updateDonor($request, $donor);

        if ($result->isFailure()) {
            return $this->redirectBackWithResult($result);
        }

        return redirect()->route('donors.index')->with('success', 'Doador atualizado com sucesso!');
    }

    public function destroy(Donor $donor): RedirectResponse
    {
        $result = $this->donorService->destroyDonor($donor);

        if ($result->isFailure()) {
            return $this->redirectBackWithResult($result);
        }

        return redirect()->route('donors.index')->with('success', 'Doador excluído com sucesso!');
    }
}
