<?php

namespace App\Contracts;

use Illuminate\Pagination\Paginator;

interface LookupHandlerInterface
{
    public function handle(?string $search = null, ?string $cascade = null): Paginator;
}