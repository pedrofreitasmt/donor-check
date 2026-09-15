<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScreeningRequest;
use App\Models\Screening;
use App\Services\ScreeningService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class ScreeningController extends Controller
{
    public function __construct(private ScreeningService $screeningService) {}

    public function index(Request $request): Response
    {
        $screenings = $this->screeningService->listScreenings($request);

        return inertia('Screening/Index', [
            'screenings' => $screenings,
            'filters' => $request->query(),
        ]);
    }

    public function create(): Response
    {
        return inertia('Screening/Create');
    }

    public function store(ScreeningRequest $request): RedirectResponse
    {
        $result = $this->screeningService->storeScreening($request);

        if ($result->isFailure()) {
            return $this->redirectBackWithResult($result);
        }

        return redirect()->route('screenings.index')->with('success', 'Triagem realizada com sucesso!');
    }

    public function show(Screening $screening): Response
    {
        $screening->load('donor');

        return inertia('Screening/Show', compact('screening'));
    }
}
