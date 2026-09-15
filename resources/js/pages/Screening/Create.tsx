import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AsyncSelect } from '@/components/custom/async-select';
import InputError from '@/components/input-error';

export default function Create() {
    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const prefilledDonorId = queryParams.get('donor_id') || '';

    const { data, setData, post, processing, errors } = useForm({
        donor_id: prefilledDonorId,
        sleep_hours_last_24h: '',
        fatty_food_last_4h: false,
        alcohol_last_12h: false,
        cold_symptoms_end_date: '',
        last_tattoo_date: '',
        std_risk_date: '',
        last_endoscopy_date: '',
        dental_procedure_date: '',
        dental_procedure_type: '',
        is_pregnant: false,
        delivery_date: '',
        delivery_type: '',
        is_breastfeeding: false,
    });

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/screenings', { preserveScroll: true });
    }

    return (
        <>
            <Head title="Nova Triagem" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Realizar Triagem Clínica</h1>
                        <p className="text-sm text-muted-foreground">
                            Preencha o questionário médico para avaliar a aptidão do doador.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl rounded-md border bg-card text-card-foreground shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-8 p-6">
                        
                        {/* Seção 1: Dados Básicos */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium">1. Identificação e Requisitos Básicos</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="donor_id">Doador <span className="text-destructive">*</span></Label>
                                    <AsyncSelect
                                        source="donor"
                                        value={data.donor_id}
                                        onChange={(val) => setData('donor_id', val)}
                                        placeholder="Buscar doador..."
                                    />
                                    <InputError message={errors.donor_id} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sleep_hours_last_24h">Horas de sono (últimas 24h) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="sleep_hours_last_24h"
                                        type="number"
                                        value={data.sleep_hours_last_24h}
                                        onChange={(e) => setData('sleep_hours_last_24h', e.target.value)}
                                        placeholder="Mínimo de 6 horas recomendado"
                                    />
                                    <InputError message={errors.sleep_hours_last_24h} />
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8 pt-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="fatty_food_last_4h"
                                        checked={data.fatty_food_last_4h}
                                        onCheckedChange={(c) => setData('fatty_food_last_4h', c === true)}
                                    />
                                    <Label htmlFor="fatty_food_last_4h" className="cursor-pointer">Alimentação gordurosa nas últimas 4h?</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="alcohol_last_12h"
                                        checked={data.alcohol_last_12h}
                                        onCheckedChange={(c) => setData('alcohol_last_12h', c === true)}
                                    />
                                    <Label htmlFor="alcohol_last_12h" className="cursor-pointer">Ingeriu álcool nas últimas 12h?</Label>
                                </div>
                            </div>
                            <InputError message={errors.fatty_food_last_4h} />
                            <InputError message={errors.alcohol_last_12h} />
                        </div>

                        <Separator />

                        {/* Seção 2: Impedimentos Temporários */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium">2. Impedimentos Temporários Gerais (Deixe em branco se não aplicável)</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cold_symptoms_end_date">Fim dos sintomas de resfriado/gripe</Label>
                                    <Input
                                        id="cold_symptoms_end_date"
                                        type="date"
                                        value={data.cold_symptoms_end_date}
                                        onChange={(e) => setData('cold_symptoms_end_date', e.target.value)}
                                    />
                                    <InputError message={errors.cold_symptoms_end_date} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_tattoo_date">Data da última tatuagem / maquiagem definitiva</Label>
                                    <Input
                                        id="last_tattoo_date"
                                        type="date"
                                        value={data.last_tattoo_date}
                                        onChange={(e) => setData('last_tattoo_date', e.target.value)}
                                    />
                                    <InputError message={errors.last_tattoo_date} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="std_risk_date">Data de situação de risco (DSTs)</Label>
                                    <Input
                                        id="std_risk_date"
                                        type="date"
                                        value={data.std_risk_date}
                                        onChange={(e) => setData('std_risk_date', e.target.value)}
                                    />
                                    <InputError message={errors.std_risk_date} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_endoscopy_date">Data do último procedimento endoscópico</Label>
                                    <Input
                                        id="last_endoscopy_date"
                                        type="date"
                                        value={data.last_endoscopy_date}
                                        onChange={(e) => setData('last_endoscopy_date', e.target.value)}
                                    />
                                    <InputError message={errors.last_endoscopy_date} />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Seção 3: Procedimentos Dentários */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium">3. Procedimentos Dentários</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="dental_procedure_date">Data do procedimento</Label>
                                    <Input
                                        id="dental_procedure_date"
                                        type="date"
                                        value={data.dental_procedure_date}
                                        onChange={(e) => setData('dental_procedure_date', e.target.value)}
                                    />
                                    <InputError message={errors.dental_procedure_date} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dental_procedure_type">Tipo de procedimento</Label>
                                    <Select
                                        value={data.dental_procedure_type}
                                        onValueChange={(value) => setData('dental_procedure_type', value)}
                                    >
                                        <SelectTrigger id="dental_procedure_type">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Não aplicável</SelectItem>
                                            <SelectItem value="extração">Extração</SelectItem>
                                            <SelectItem value="canal">Tratamento de Canal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.dental_procedure_type} />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Seção 4: Mulheres */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium">4. Para Mulheres</h2>
                            
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8 mb-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_pregnant"
                                        checked={data.is_pregnant}
                                        onCheckedChange={(c) => setData('is_pregnant', c === true)}
                                    />
                                    <Label htmlFor="is_pregnant" className="cursor-pointer">Está grávida?</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_breastfeeding"
                                        checked={data.is_breastfeeding}
                                        onCheckedChange={(c) => setData('is_breastfeeding', c === true)}
                                    />
                                    <Label htmlFor="is_breastfeeding" className="cursor-pointer">Está amamentando?</Label>
                                </div>
                            </div>
                            <InputError message={errors.is_pregnant} />
                            <InputError message={errors.is_breastfeeding} />

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="delivery_date">Data do Parto (Se houver recente)</Label>
                                    <Input
                                        id="delivery_date"
                                        type="date"
                                        value={data.delivery_date}
                                        onChange={(e) => setData('delivery_date', e.target.value)}
                                    />
                                    <InputError message={errors.delivery_date} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="delivery_type">Tipo de Parto</Label>
                                    <Select
                                        value={data.delivery_type}
                                        onValueChange={(value) => setData('delivery_type', value)}
                                    >
                                        <SelectTrigger id="delivery_type">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Não aplicável</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="cesariana">Cesariana</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.delivery_type} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <Button className="cursor-pointer" type="submit" disabled={processing}>
                                Finalizar Triagem
                            </Button>
                            <Button variant="outline" type="button" asChild>
                                <Link href="/screenings">Cancelar</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Create.layout = {
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
            title: 'Nova Triagem',
            href: '/screenings/create',
        },
    ],
};
