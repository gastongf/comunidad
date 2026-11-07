import { Head, Link } from '@inertiajs/react';
import { CalendarCheck } from 'lucide-react';
import { ActivityDetail } from '@/components/activity-detail';
import type { ActivitySummary } from '@/components/activity-card';
import { Button } from '@/components/ui/button';

export default function VerActividad({
    actividad,
    categorias,
}: {
    actividad: ActivitySummary;
    categorias: Record<string, string>;
}) {
    const contact = actividad.contact_or_link;
    const isUrl = contact ? /^https?:\/\//i.test(contact) : false;
    const isEmail = contact ? /^\S+@\S+\.\S+$/.test(contact) : false;

    return (
        <>
            <Head title={actividad.title} />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
                <ActivityDetail
                    activity={actividad}
                    categories={categorias}
                    footer={
                        <>
                            {(isUrl || isEmail) && contact && (
                                <Button asChild>
                                    <a href={isEmail ? `mailto:${contact}` : contact} target="_blank" rel="noopener noreferrer">
                                        <CalendarCheck /> Registrarme al evento
                                    </a>
                                </Button>
                            )}
                            {contact && !isUrl && !isEmail && (
                                <p className="text-sm">
                                    <span className="font-medium">Para registrarte, contacta: </span>
                                    {contact}
                                </p>
                            )}
                            <Button asChild variant="outline">
                                <Link href="/actividades">Volver</Link>
                            </Button>
                        </>
                    }
                />
            </div>
        </>
    );
}
