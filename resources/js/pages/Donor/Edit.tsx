import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface Donor {
    id: number;
    name: string;
    birth_date: string;
    gender: string;
    weight: number;
    document_type: string;
    document_number: string;
    first_donation_date?: string | null;
}

interface EditProps {
    donor: Donor;
}

export default function Edit({ donor }: EditProps) {
    const formatDateForInput = (dateString?: string | null) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    const { data, setData, put, processing, errors } = useForm({
        name: donor.name || '',
        birth_date: formatDateForInput(donor.birth_date),
        gender: donor.gender || '',
        weight: donor.weight ? String(donor.weight) : '',
        document_type: donor.document_type || '',
        document_number: donor.document_number || '',
        first_donation_date: formatDateForInput(donor.first_donation_date),
    });

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        put(`/donors/${donor.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={`Editar Doador: ${donor.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Editar Doador</h1>
                        <p className="text-sm text-muted-foreground">
                            Atualize as informações do doador {donor.name}.
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl rounded-md border bg-card text-card-foreground shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo <span className="text-destructive">*</span></Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="document_type">Tipo de Documento <span className="text-destructive">*</span></Label>
                                <Select
                                    value={data.document_type}
                                    onValueChange={(value) => setData('document_type', value)}
                                >
                                    <SelectTrigger id="document_type">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RG">RG</SelectItem>
                                        <SelectItem value="CNH">CNH</SelectItem>
                                        <SelectItem value="CTPS">CTPS</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.document_type} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="document_number">Número do Documento <span className="text-destructive">*</span></Label>
                                <Input
                                    id="document_number"
                                    value={data.document_number}
                                    onChange={(e) => setData('document_number', e.target.value)}
                                />
                                <InputError message={errors.document_number} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="birth_date">Nascimento <span className="text-destructive">*</span></Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                />
                                <InputError message={errors.birth_date} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gênero <span className="text-destructive">*</span></Label>
                                <Select
                                    value={data.gender}
                                    onValueChange={(value) => setData('gender', value)}
                                >
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">Masculino</SelectItem>
                                        <SelectItem value="F">Feminino</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gender} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight">Peso (kg) <span className="text-destructive">*</span></Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    value={data.weight}
                                    onChange={(e) => setData('weight', e.target.value)}
                                />
                                <InputError message={errors.weight} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="first_donation_date">Data da Primeira Doação (Opcional)</Label>
                            <Input
                                id="first_donation_date"
                                type="date"
                                value={data.first_donation_date}
                                onChange={(e) => setData('first_donation_date', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Necessário caso o doador seja maior de 60 anos.
                            </p>
                            <InputError message={errors.first_donation_date} />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <Button className="cursor-pointer" type="submit" disabled={processing}>
                                Atualizar Doador
                            </Button>
                            <Button variant="outline" type="button" asChild>
                                <Link href="/donors">Cancelar</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Doadores',
            href: '/donors',
        },
        {
            title: 'Editar Doador',
            href: '#',
        },
    ],
};
