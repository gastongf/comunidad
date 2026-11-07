import { Head } from '@inertiajs/react';
import { EmpleoFormFields } from '@/components/empleo-form';
import type { EmpleoFormData } from '@/components/empleo-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Option = { id: number; name: string };

export default function EditarEmpleo(props: {
    empleo: EmpleoFormData;
    categories: Option[];
    regions: Option[];
    communes: (Option & { region_id: number })[];
}) {
    return (
        <>
            <Head title="Editar empleo" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="mb-2 text-2xl font-semibold">Editar empleo</h1>
                {props.empleo.status === 'rechazado' && props.empleo.rejection_reason && (
                    <Alert variant="destructive">
                        <AlertTitle>Empleo rechazado</AlertTitle>
                        <AlertDescription>{props.empleo.rejection_reason}</AlertDescription>
                    </Alert>
                )}
                <p className="text-sm text-muted-foreground">Al guardar, el empleo vuelve a revisión.</p>
                <EmpleoFormFields action={`/mis-empleos/${props.empleo.id}`} method="put" submitLabel="Guardar cambios" {...props} />
            </div>
        </>
    );
}

EditarEmpleo.layout = {
    breadcrumbs: [
        { title: 'Mis empleos', href: '/mis-empleos' },
        { title: 'Editar empleo', href: '#' },
    ],
};
