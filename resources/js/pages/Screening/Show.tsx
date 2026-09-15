import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Donor {
    id: number;
    name: string;
    document_number: string;
}

interface Screening {
    id: number;
    donor_id: number;
    donor: Donor;
    is_apt: boolean;
    rejection_reasons?: string[] | null;
    created_at: string;
}

interface ShowProps {
    screening: Screening;
}

export default function Show({ screening }: ShowProps) {
    const isApt = screening.is_apt;

    return (
        <>
            <Head title={`Triagem #${screening.id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Laudo da Triagem #{screening.id}</h1>
                        <p className="text-sm text-muted-foreground">
                            Realizada em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(screening.created_at))}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/donors/${screening.donor_id}/edit`}>Perfil do Doador</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/screenings">Voltar</Link>
                        </Button>
                    </div>
                </div>

                <div className="max-w-4xl rounded-md border bg-card text-card-foreground shadow-sm p-6 space-y-8">
                    
                    <div>
                        <h2 className="text-lg font-medium mb-4">Dados do Doador</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Nome</p>
                                <p className="font-medium">{screening.donor.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Documento</p>
                                <p className="font-medium">{screening.donor.document_number}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h2 className="text-lg font-medium mb-4">Parecer Médico</h2>
                        
                        {isApt ? (
                            <Alert className="bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <AlertTitle className="text-lg">Apto para Doação</AlertTitle>
                                <AlertDescription>
                                    O doador atende a todos os requisitos e não apresenta nenhum impedimento médico temporário.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="destructive">
                                <AlertCircle className="h-5 w-5" />
                                <AlertTitle className="text-lg">Inapto Temporariamente</AlertTitle>
                                <AlertDescription className="mt-4">
                                    <p className="mb-2">O doador não pode realizar a doação no momento pelos seguintes motivos:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {screening.rejection_reasons?.map((reason, idx) => (
                                            <li key={idx}>{reason}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Triagens',
            href: '/screenings',
        },
        {
            title: 'Laudo',
            href: '#',
        },
    ],
};
