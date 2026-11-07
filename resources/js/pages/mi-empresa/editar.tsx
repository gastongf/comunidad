import { Head } from '@inertiajs/react';
import { EmpresaFormFields } from '@/components/empresa-form';
import type { EmpresaForm, Region } from '@/components/empresa-form';

export default function MiEmpresa({ empresa, regions }: { empresa: EmpresaForm; regions: Region[] }) {
    return (
        <>
            <Head title="Mi empresa" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="mb-6 text-2xl font-semibold">Mi empresa</h1>
                <EmpresaFormFields action="/mi-empresa" method="put" regions={regions} empresa={empresa} submitLabel="Guardar cambios" hideStatus />
            </div>
        </>
    );
}

MiEmpresa.layout = {
    breadcrumbs: [{ title: 'Mi empresa', href: '/mi-empresa' }],
};
