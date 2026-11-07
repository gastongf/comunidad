import { Head } from "@inertiajs/react";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { dashboard } from "@/routes";

export default function IndexUsuarios() {
    return (
        <>
            <Head title="Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <p>Usuario</p>
            </div>
        </>
    );
}

IndexUsuarios.layout = {
    breadcrumbs: [
        {
            title: "Usuarios",
            href: '/usuarios',
        },
    ],
};
