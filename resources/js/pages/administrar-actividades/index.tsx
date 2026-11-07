import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ActivityCard } from '@/components/activity-card';
import type { ActivitySummary } from '@/components/activity-card';
import { FilterTabs } from '@/components/filter-tabs';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    actividades: Paginated<ActivitySummary>;
    categorias: Record<string, string>;
    estadoActivo: string;
};

const statusOptions = [
    { value: null, label: 'En revisión' },
    { value: 'publicado', label: 'Publicadas' },
    { value: 'rechazado', label: 'Rechazadas' },
    { value: 'todos', label: 'Todas' },
];

export default function AdministrarActividades({ actividades, categorias, estadoActivo }: Props) {
    const [rejecting, setRejecting] = useState<number | null>(null);
    const [note, setNote] = useState('');

    const moderate = (id: number, status: string, adminNote?: string) =>
        router.patch(
            `/administrar-actividades/${id}`,
            { status, admin_note: adminNote },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejecting(null);
                    setNote('');
                },
            },
        );

    return (
        <>
            <Head title="Administrar actividades" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1>Administrar actividades</h1>
                    <p className="text-sm text-muted-foreground">
                        Revisa, publica o rechaza las actividades propuestas por la comunidad.
                    </p>
                </div>

                <FilterTabs
                    options={statusOptions}
                    active={estadoActivo === 'en_revision' ? null : estadoActivo}
                    baseUrl="/administrar-actividades"
                    param="estado"
                />

                {actividades.data.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">No hay actividades en este estado.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {actividades.data.map((actividad) => (
                            <ActivityCard
                                key={actividad.id}
                                activity={actividad}
                                categories={categorias}
                                showStatus
                                footer={
                                    <div className="flex w-full flex-col gap-2">
                                        <p className="text-xs text-muted-foreground">
                                            Por {actividad.author?.name} ({actividad.author?.email})
                                        </p>
                                        <Button asChild variant="outline" size="sm" className="w-fit">
                                            <Link href={`/actividades/${actividad.id}`}>Ver detalle</Link>
                                        </Button>
                                        {rejecting === actividad.id ? (
                                            <>
                                                <Textarea
                                                    value={note}
                                                    onChange={(event) => setNote(event.target.value)}
                                                    placeholder="Motivo del rechazo"
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="destructive"
                                                        disabled={note.trim() === ''}
                                                        onClick={() => moderate(actividad.id, 'rechazado', note)}
                                                    >
                                                        Confirmar rechazo
                                                    </Button>
                                                    <Button variant="outline" onClick={() => setRejecting(null)}>
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {actividad.status !== 'publicado' && (
                                                    <Button onClick={() => moderate(actividad.id, 'publicado')}>
                                                        Aprobar
                                                    </Button>
                                                )}
                                                {actividad.status !== 'rechazado' && (
                                                    <Button variant="outline" onClick={() => setRejecting(actividad.id)}>
                                                        Rechazar
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        if (confirm('¿Eliminar esta actividad?')) {
                                                            router.delete(`/administrar-actividades/${actividad.id}`, {
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
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

AdministrarActividades.layout = {
    breadcrumbs: [{ title: 'Administrar actividades', href: '/administrar-actividades' }],
};
