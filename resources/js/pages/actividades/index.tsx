import { Head, Link } from '@inertiajs/react';
import { ActivityCard } from '@/components/activity-card';
import type { ActivitySummary } from '@/components/activity-card';
import { FilterTabs } from '@/components/filter-tabs';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { Button } from '@/components/ui/button';

type Props = {
    actividades: Paginated<ActivitySummary>;
    categorias: Record<string, string>;
    categoriaActiva: string | null;
};

export default function IndexActividades({ actividades, categorias, categoriaActiva }: Props) {
    const options = [
        { value: null, label: 'Todas' },
        ...Object.entries(categorias).map(([value, label]) => ({ value, label })),
    ];

    return (
        <>
            <Head title="Congresos y actividades" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1>Congresos y actividades</h1>
                        <p className="text-sm text-muted-foreground">
                            Cursos gratuitos, becas, congresos y eventos de la comunidad.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/mis-actividades">Mis actividades</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/actividades/crear">Proponer actividad</Link>
                        </Button>
                    </div>
                </div>

                <FilterTabs options={options} active={categoriaActiva} baseUrl="/actividades" param="categoria" />

                {actividades.data.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                        No hay actividades publicadas en esta categoría.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {actividades.data.map((actividad) => (
                            <ActivityCard
                                key={actividad.id}
                                activity={actividad}
                                categories={categorias}
                                footer={
                                    <Button asChild>
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

IndexActividades.layout = {
    breadcrumbs: [{ title: 'Congresos y actividades', href: '/actividades' }],
};
