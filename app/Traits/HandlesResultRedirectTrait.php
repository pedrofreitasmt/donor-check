<?php

namespace App\Traits;

use App\Support\Result;
use Illuminate\Http\RedirectResponse;

/**
 * Abstrai o padrão de redirect de volta com erros baseado no objeto Result.
 */
trait HandlesResultRedirectTrait
{
    /**
     * Redireciona de volta com os erros e a mensagem do Result.
     *
     * @param Result $result
     * @return RedirectResponse
     */
    protected function redirectBackWithResult(Result $result): RedirectResponse
    {
        $redirect = redirect()->back();

        if ($result->hasErrors()) {
            $redirect->withErrors($result->getErrors());
        }

        if ($result->getMessage()) {
            $redirect->with('error', $result->getMessage());
        }

        return $redirect;
    }
}