import { Head, Link } from '@inertiajs/react';
import { ForumTopicCard } from '@/components/forum-topic-card';
import type { ForumTopicSummary } from '@/components/forum-topic-card';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { Button } from '@/components/ui/button';

export default function MisTemas({
    temas,
    etiquetas,
}: {
    temas: Paginated<ForumTopicSummary>;
    etiquetas: Record<string, string>;
}) {
    return (
        <>
            <Head title="Mis temas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Mis temas</h1>
                        <p className="text-sm text-muted-foreground">Estado de revisión de tus discusiones.</p>
                    </div>
                    <Button asChild>
                        <Link href="/comunidades/crear">Nuevo tema</Link>
                    </Button>
                </div>

                {temas.data.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">Aún no has creado temas.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {temas.data.map((tema) => (
                            <ForumTopicCard
                                key={tema.id}
                                topic={tema}
                                tags={etiquetas}
                                showStatus
                                footer={
                                    <Button asChild variant="outline">
                                        <Link href={`/comunidades/${tema.id}`}>Ver discusión</Link>
                                    </Button>
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

MisTemas.layout = {
    breadcrumbs: [{ title: 'Mis temas', href: '/mis-temas' }],
};
