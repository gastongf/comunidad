import { Head, Link } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { ActivityDetail } from '@/components/activity-detail';
import type { ActivitySummary } from '@/components/activity-card';
import { PublicNavbar } from '@/components/public-navbar';
import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';

export default function ActividadPublica({
    actividad,
    categorias,
}: {
    actividad: ActivitySummary;
    categorias: Record<string, string>;
}) {
    return (
        <div className="dark relative min-h-screen overflow-hidden bg-[#080a0b] text-white">
            <Head title={actividad.title} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(54,130,111,0.2),transparent_38%),radial-gradient(ellipse_at_15%_85%,rgba(70,80,145,0.16),transparent_35%)]" />
            <PublicNavbar landing />
            <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-4 p-4 pt-28">
                <ActivityDetail
                    activity={actividad}
                    categories={categorias}
                    footer={
                        <>
                            <Button asChild>
                                <Link href={login()}>
                                    <Lock /> Registrarme al evento
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={register()}>Crear cuenta</Link>
                            </Button>
                            <Button asChild variant="ghost">
                                <Link href="/actividades">Volver</Link>
                            </Button>
                        </>
                    }
                />
            </div>
        </div>
    );
}
