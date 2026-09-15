<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait FilterTrait
{
    protected function filter(Builder $query, Request $request): void
    {
        $model = $query->getModel();

        // Parâmetros de query que não são filtros de modelo (ex.: tabs de UI)
        $ignoredQueryParams = ['page', 'tab'];

        foreach ($request->query() as $key => $value) {
            if (in_array($key, $ignoredQueryParams, true) || !$request->filled($key)) {
                continue;
            }

            $parameterRecognized = false;

            if ($this->columnExistsOnModel($model, $key)) {
                $parameterRecognized = true;
                $this->applyDirectFilter($query, $model, $key, $value);
            } elseif ($this->isRelationFilter($key)) {
                [$relations, $field] = $this->resolveRelationPathAndField($model, $key);

                if (!empty($relations)) {
                    $relatedModel = $this->getRelatedModelInstance($model, $relations);

                    if ($relatedModel && $this->columnExistsOnModel($relatedModel, $field)) {
                        $parameterRecognized = true;
                        $this->applyNestedRelationFilter($query, $relations, $field, $value);
                    }
                }
            }

            if (!$parameterRecognized) {
                \Illuminate\Support\Facades\Log::warning("FilterTrait: parâmetro '{$key}' não reconhecido.");
            }
        }
    }

    // --- Helpers de Validação ---

    private function getRelatedModelInstance(Model $model, array $relations): ?Model
    {
        $currentModel = $model;

        foreach ($relations as $relationName) {
            if (!method_exists($currentModel, $relationName)) {
                return null;
            }

            try {
                $relation = $currentModel->{$relationName}();
                // Garante que é uma relação do Eloquent
                if (!$relation instanceof \Illuminate\Database\Eloquent\Relations\Relation) {
                    return null;
                }
                $currentModel = $relation->getRelated();
            } catch (\Throwable $e) {
                return null;
            }
        }

        return $currentModel;
    }

    /**
     * Verifica se o campo está no array $filterable do model.
     * IMPORTANTE: campos filtráveis DEVEM estar no $filterable do model.
     */
    private function columnExistsOnModel(Model $model, string $column): bool
    {
        return in_array($column, $model->filterable ?? []) ||
            ($model->getKeyName() === $column); // Permite filtrar pelo ID/PK
    }

    private function isRelationFilter(string $key): bool
    {
        return str_contains($key, '_');
    }

    // --- Lógica de Aplicação dos Filtros ---

    private function applyDirectFilter(Builder $query, Model $model, string $key, string $value): void
    {
        if ($this->isDateCast($model, $key)) {
            $this->handleDateFilter($query, $key, $value);
        } elseif ($this->isIdColumn($key)) {
            $query->where($key, $value);
        } else {
            $query->where($key, 'like', "%{$value}%");
        }
    }

    private function applyNestedRelationFilter(Builder $query, array $relations, string $field, string $value): void
    {
        $relation = array_shift($relations);

        $query->whereHas($relation, function ($subQuery) use ($relations, $field, $value) {
            if (empty($relations)) {
                // Chegamos ao final da árvore de relação, aplicamos o filtro no model atual
                $this->applyDirectFilter($subQuery, $subQuery->getModel(), $field, $value);
            } else {
                // Continua descendo na recursão
                $this->applyNestedRelationFilter($subQuery, $relations, $field, $value);
            }
        });
    }

    // --- Helpers Utilitários ---

    private function isDateCast(Model $model, string $column): bool
    {
        return $model->hasCast($column, ['date', 'datetime', 'timestamp', 'immutable_date', 'immutable_datetime']);
    }

    private function isIdColumn(string $column): bool
    {
        return $column === 'id' || str_ends_with($column, '_id');
    }

    private function handleDateFilter(Builder $query, string $column, string $value): void
    {
        try {
            $date = Carbon::parse($value)->format('Y-m-d');
            $query->whereDate($column, $date);
        } catch (\Exception $e) {
            // Se a data for inválida, ignoramos ou abortamos.
            // Como estamos estritos, melhor abortar ou ignorar. Aqui vou ignorar para não quebrar o flow.
        }
    }

    private function resolveRelationPathAndField($model, string $key): array
    {
        $parts = explode('_', $key);
        $relations = [];
        $currentModel = $model;
        $i = 0;
        $n = count($parts);

        while ($i < $n) {
            $matched = false;
            // Tenta casar o maior nome possível (ex: 'process_detail' em vez de 'process')
            for ($j = $n; $j > $i; $j--) {
                $candidateSnake = implode('_', array_slice($parts, $i, $j - $i));
                $method = Str::camel($candidateSnake);

                if (method_exists($currentModel, $method)) {
                    try {
                        $relation = $currentModel->{$method}();
                        if ($relation instanceof \Illuminate\Database\Eloquent\Relations\Relation) {
                            $relations[] = $method;
                            $currentModel = $relation->getRelated();
                            $i = $j;
                            $matched = true;
                            break;
                        }
                    } catch (\Throwable $e) {
                    }
                }
            }

            if (!$matched) {
                $field = implode('_', array_slice($parts, $i));
                return [$relations, $field];
            }
        }
        return [$relations, ''];
    }
}