import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Donor {
    id: number;
    name: string;
}

interface Screening {
    id: number;
    donor_id: number;
    donor?: Donor;
    created_at: string;
}

interface IndexProps {
    screenings?: {
        data: Screening[];
    };
    filters?: Record<string, string>;
}

export default function Index({ screenings, filters = {} }: IndexProps) {
    return (
        <>
            <Head title="Triagens" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Lista de Triagens</h1>
                        <p className="text-sm text-muted-foreground">
                            Histórico de triagens clínicas realizadas.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/screenings/create">
                            Nova Triagem
                        </Link>
                    </Button>
                </div>
                
                <div className="overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="h-12 px-4 font-medium align-middle">ID</th>
                                    <th className="h-12 px-4 font-medium align-middle">Doador</th>
                                    <th className="h-12 px-4 font-medium align-middle">Data da Triagem</th>
                                    <th className="h-12 px-4 font-medium align-middle text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {screenings?.data && screenings.data.length > 0 ? (
                                    screenings.data.map((screening) => (
                                        <tr key={screening.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-4 align-middle">#{screening.id}</td>
                                            <td className="p-4 align-middle font-medium">
                                                {screening.donor?.name || `Doador #${screening.donor_id}`}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {screening.created_at 
                                                    ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(screening.created_at))
                                                    : '-'}
                                            </td>
                                            <td className="p-4 align-middle text-right space-x-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/screenings/${screening.id}`}>Ver Laudo</Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="h-24 text-center text-muted-foreground">
                                            Nenhuma triagem realizada.
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
            title: 'Triagens',
            href: '/screenings',
        },
    ],
};
