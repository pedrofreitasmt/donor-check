import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DonorFilter } from './_Filter';

interface Donor {
    id: number;
    name: string;
    document_type: string;
    document_number: string;
    birth_date: string;
    gender: string;
}

interface IndexProps {
    donors?: {
        data: Donor[];
    };
    filters?: Record<string, string>;
}

export default function Index({ donors, filters = {} }: IndexProps) {
    return (
        <>
            <Head title="Doadores" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Lista de Doadores</h1>
                        <p className="text-sm text-muted-foreground">
                            Gerencie os doadores cadastrados no sistema.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/donors/create">
                            Novo Doador
                        </Link>
                    </Button>
                </div>
                
                <DonorFilter filters={filters} />
                
                <div className="overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="h-12 px-4 font-medium align-middle">Nome</th>
                                    <th className="h-12 px-4 font-medium align-middle">Tipo de Documento</th>
                                    <th className="h-12 px-4 font-medium align-middle">Documento</th>
                                    <th className="h-12 px-4 font-medium align-middle">Nascimento</th>
                                    <th className="h-12 px-4 font-medium align-middle text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {donors?.data && donors.data.length > 0 ? (
                                    donors.data.map((donor) => (
                                        <tr key={donor.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-4 align-middle font-medium">{donor.name}</td>
                                            <td className="p-4 align-middle">
                                                {donor.document_type}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {donor.document_number}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {donor.birth_date 
                                                    ? new Intl.DateTimeFormat('pt-BR').format(new Date(donor.birth_date))
                                                    : '-'}
                                            </td>
                                            <td className="p-4 align-middle text-right space-x-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/donors/${donor.id}/edit`}>Editar</Link>
                                                </Button>
                                                <Button className="cursor-pointer" variant="destructive" size="sm" asChild>
                                                    <Link href={`/donors/${donor.id}`} method="delete" as="button">Excluir</Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="h-24 text-center text-muted-foreground">
                                            Nenhum doador cadastrado no sistema.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Doadores',
            href: '/donors',
        },
    ],
};
