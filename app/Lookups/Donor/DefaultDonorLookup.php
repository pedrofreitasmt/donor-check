<?php

namespace App\Lookups\Donor;

use App\Contracts\LookupHandlerInterface;
use App\Models\Donor;
use Illuminate\Pagination\Paginator;

class DefaultDonorLookup implements LookupHandlerInterface
{
    public function handle(?string $search = null, ?string $cascade = null): Paginator
    {
        $query = Donor::query()
            ->select('id', 'name')
            ->orderBy('name');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('document_number', 'like', "%{$search}%");
            });
        }

        return $query->simplePaginate(15);
    }
}