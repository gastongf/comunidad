import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FilterTabs } from '@/components/filter-tabs';
import { ForumTopicCard } from '@/components/forum-topic-card';
import type { ForumTopicSummary } from '@/components/forum-topic-card';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    temas: Paginated<ForumTopicSummary>;
    etiquetas: Record<string, string>;
    estadoActivo: string;
};

const statusOptions = [
    { value: null, label: 'En revisión' },
    { value: 'publicado', label: 'Publicados' },
    { value: 'rechazado', label: 'Rechazados' },
    { value: 'todos', label: 'Todos' },
];

export default function AdministrarComunidades({ temas, etiquetas, estadoActivo }: Props) {
    const [rejecting, setRejecting] = useState<number | null>(null);
    const [note, setNote] = useState('');

    const update = (id: number, data: Record<string, unknown>) =>
        router.patch(`/administrar-comunidades/${id}`, data as never, {
            preserveScroll: true,
            onSuccess: () => {
                setRejecting(null);
                setNote('');
            },
        });

    return (
        <>
            <Head title="Administrar comunidades" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1>Administrar comunidades</h1>
                    <p className="text-sm text-muted-foreground">Modera los temas propuestos en los foros.</p>
                </div>

                <FilterTabs
                    options={statusOptions}
                    active={estadoActivo === 'en_revision' ? null : estadoActivo}
                    baseUrl="/administrar-comunidades"
                    param="estado"
                />

                {temas.data.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">No hay temas en este estado.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {temas.data.map((tema) => (
                            <ForumTopicCard
                                key={tema.id}
                                topic={tema}
                                tags={etiquetas}
                                showStatus
                                footer={
                                    <div className="flex w-full flex-col gap-2">
                                        {rejecting === tema.id ? (
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
                                                        onClick={() => update(tema.id, { status: 'rechazado', admin_note: note })}
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
                                                {tema.status !== 'publicado' && (
                                                    <Button onClick={() => update(tema.id, { status: 'publicado' })}>
                                                        Aprobar
                                                    </Button>
                                                )}
                                                {tema.status !== 'rechazado' && (
                                                    <Button variant="outline" onClick={() => setRejecting(tema.id)}>
                                                        Rechazar
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => update(tema.id, { is_pinned: !tema.is_pinned })}
                                                >
                                                    {tema.is_pinned ? 'Desfijar' : 'Fijar'}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => update(tema.id, { is_closed: !tema.is_closed })}
                                                >
                                                    {tema.is_closed ? 'Reabrir' : 'Cerrar'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        ))}
                    </div>
                )}

                <JobPagination links={temas.links} />
            </div>
        </>
    );
}

AdministrarComunidades.layout = {
    breadcrumbs: [{ title: 'Administrar comunidades', href: '/administrar-comunidades' }],
};
