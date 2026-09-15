<?php

namespace App\Services;

use App\Contracts\LookupHandlerInterface;

class LookupService
{
    /**
     * Retorna a instância do handler para o source informado.
     *
     * @throws \RuntimeException
     */
    public function getHandler(string $source): LookupHandlerInterface
    {
        /** @var array<string, class-string<LookupHandlerInterface>> $sources */
        $sources = config('lookup_sources.sources', []);
        
        $handlerClass = $sources[$source] ?? null;

        if (! $handlerClass) {
            throw new \RuntimeException("Configuração não encontrada para lookup_sources.sources.{$source}");
        }

        if (! class_exists($handlerClass)) {
            throw new \RuntimeException("Action de Lookup não encontrada: {$handlerClass} (chave: {$source})");
        }

        if (! is_subclass_of($handlerClass, LookupHandlerInterface::class)) {
            throw new \RuntimeException("O handler {$handlerClass} deve implementar LookupHandlerInterface");
        }

        return app($handlerClass);
    }
}