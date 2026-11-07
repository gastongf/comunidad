import { Head } from '@inertiajs/react';
import { EmpresaFormFields } from '@/components/empresa-form';
import type { Region } from '@/components/empresa-form';

export default function CrearEmpresas({ regions }: { regions: Region[] }) {
    return (
        <>
            <Head title="Crear empresa" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="mb-6 text-2xl font-semibold">Crear empresa</h1>
                <EmpresaFormFields action="/empresas" method="post" regions={regions} submitLabel="Crear Empresa" />
            </div>
        </>
    );
}

CrearEmpresas.layout = {
    breadcrumbs: [
        { title: 'Empresas', href: '/empresas' },
        { title: 'Crear Empresa', href: '/empresas/crear' },
    ],
};
