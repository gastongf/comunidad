import { Head } from '@inertiajs/react';
import { EmpresaFormFields } from '@/components/empresa-form';
import type { EmpresaForm, Region } from '@/components/empresa-form';

export default function EditarEmpresa({ empresa, regions }: { empresa: EmpresaForm; regions: Region[] }) {
    return (
        <>
            <Head title="Editar empresa" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="mb-6 text-2xl font-semibold">Editar empresa</h1>
                <EmpresaFormFields action={`/empresas/${empresa.id}`} method="put" regions={regions} empresa={empresa} submitLabel="Guardar cambios" />
            </div>
        </>
    );
}

EditarEmpresa.layout = {
    breadcrumbs: [
        { title: 'Empresas', href: '/empresas' },
        { title: 'Editar Empresa', href: '#' },
    ],
};
