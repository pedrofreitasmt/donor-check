import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface FilterProps {
    filters?: Record<string, string>;
}

export function DonorFilter({ filters = {} }: FilterProps) {
    const [data, setData] = useState({
        name: filters.name || '',
        document_number: filters.document_number || '',
    });

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Remove empty values to keep the URL clean
        const query = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v.trim() !== '')
        );

        router.get('/donors', query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClear = () => {
        setData({ name: '', document_number: '' });
        router.get('/donors', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasFilters = Boolean(filters.name || filters.document_number);

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 mb-6 p-4 border rounded-md bg-muted/20">
            <div className="grid gap-2 flex-1 min-w-[200px]">
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <Input
                    id="name"
                    placeholder="Buscar por nome..."
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                />
            </div>
            
            <div className="grid gap-2 flex-1 min-w-[200px]">
                <label htmlFor="document_number" className="text-sm font-medium">Documento</label>
                <Input
                    id="document_number"
                    placeholder="Buscar por CPF/RG..."
                    value={data.document_number}
                    onChange={(e) => setData({ ...data, document_number: e.target.value })}
                />
            </div>

            <div className="flex gap-2">
                <Button type="submit" variant="default" className="cursor-pointer">
                    <Search className="w-4 h-4 mr-2" />
                    Filtrar
                </Button>
                
                {hasFilters && (
                    <Button type="button" variant="outline" onClick={handleClear} className="cursor-pointer">
                        <X className="w-4 h-4 mr-2" />
                        Limpar
                    </Button>
                )}
            </div>
        </form>
    );
}
