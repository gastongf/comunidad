import { Head, Link } from '@inertiajs/react';
import { ActivityCard } from '@/components/activity-card';
import type { ActivitySummary } from '@/components/activity-card';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { Button } from '@/components/ui/button';

type Props = {
    actividades: Paginated<ActivitySummary>;
    categorias: Record<string, string>;
};

export default function MisActividades({ actividades, categorias }: Props) {
    return (
        <>
            <Head title="Mis actividades" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Mis actividades</h1>
                        <p className="text-sm text-muted-foreground">
                            Seguimiento del estado de revisión de tus propuestas.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/actividades/crear">Proponer actividad</Link>
                    </Button>
                </div>

                {actividades.data.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                        Aún no has propuesto actividades.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {actividades.data.map((actividad) => (
                            <ActivityCard
                                key={actividad.id}
                                activity={actividad}
                                categories={categorias}
                                showStatus
                                footer={
                                    <Button asChild variant="outline">
                                        <Link href={`/actividades/${actividad.id}`}>Ver detalle</Link>
                                    </Button>
                                }
                            />
                        ))}
                    </div>
                )}

                <JobPagination links={actividades.links} />
            </div>
        </>
    );
}

MisActividades.layout = {
    breadcrumbs: [{ title: 'Mis actividades', href: '/mis-actividades' }],
};
