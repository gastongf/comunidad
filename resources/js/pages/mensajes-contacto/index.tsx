import { Head } from '@inertiajs/react';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Message = {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
};

export default function MensajesContacto({ mensajes }: { mensajes: Paginated<Message> }) {
    return (
        <>
            <Head title="Mensajes de contacto" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1>Mensajes de contacto</h1>
                    <p className="text-sm text-muted-foreground">Consultas recibidas desde el formulario de contacto.</p>
                </div>

                {mensajes.data.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">No hay mensajes.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {mensajes.data.map((mensaje) => (
                            <Card key={mensaje.id}>
                                <CardHeader>
                                    <CardTitle className="text-base font-bold">{mensaje.subject}</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {mensaje.name} ({mensaje.email}) ·{' '}
                                        {new Date(mensaje.created_at).toLocaleDateString('es-CL')}
                                    </p>
                                    <CardDescription className="whitespace-pre-line">{mensaje.message}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}

                <JobPagination links={mensajes.links} />
            </div>
        </>
    );
}

MensajesContacto.layout = {
    breadcrumbs: [{ title: 'Mensajes de contacto', href: '/mensajes-contacto' }],
};
