<?php

namespace App\Http\Controllers;

use App\Http\Requests\LookupRequest;
use App\Services\LookupService;
use Illuminate\Http\JsonResponse;

class LookupController extends Controller
{
    public function __construct(private LookupService $lookupService) {}

    public function __invoke(LookupRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $handler = $this->lookupService->getHandler($validated['source']);

        $paginator = $handler->handle($validated['search'] ?? null, $validated['cascade'] ?? null);

        return response()->json([
            'options' => $paginator->items(),
            'hasMore' => $paginator->hasMorePages(),
            'additional' => [
                'nextPage' => $paginator->hasMorePages()
                    ? $paginator->currentPage() + 1
                    : null,
            ],
        ]);
    }
}