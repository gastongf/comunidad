import { Head } from '@inertiajs/react';
import { EmpleoFormFields } from '@/components/empleo-form';

type Option = { id: number; name: string };

export default function CrearEmpleo(props: {
    categories: Option[];
    regions: Option[];
    communes: (Option & { region_id: number })[];
}) {
    return (
        <>
            <Head title="Nuevo empleo" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="mb-2 text-2xl font-semibold">Nuevo empleo</h1>
                <p className="text-sm text-muted-foreground">El empleo quedará pendiente hasta que un administrador lo apruebe.</p>
                <EmpleoFormFields action="/mis-empleos" method="post" submitLabel="Crear empleo" {...props} />
            </div>
        </>
    );
}

CrearEmpleo.layout = {
    breadcrumbs: [
        { title: 'Mis empleos', href: '/mis-empleos' },
        { title: 'Nuevo empleo', href: '/mis-empleos/crear' },
    ],
};
