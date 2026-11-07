import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { FilterTabs } from '@/components/filter-tabs';
import { ForumTopicCard } from '@/components/forum-topic-card';
import type { ForumTopicSummary } from '@/components/forum-topic-card';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
    temas: Paginated<ForumTopicSummary>;
    etiquetas: Record<string, string>;
    filtros: { tag: string | null; q: string | null };
};

export default function IndexComunidades({ temas, etiquetas, filtros }: Props) {
    const [search, setSearch] = useState(filtros.q ?? '');
    const options = [
        { value: null, label: 'Todos' },
        ...Object.entries(etiquetas).map(([value, label]) => ({ value, label })),
    ];

    return (
        <>
            <Head title="Comunidades" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1>Comunidades</h1>
                        <p className="text-sm text-muted-foreground">
                            Foros de discusión y colaboración entre científicos.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/mis-temas">Mis temas</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/comunidades/crear">Nuevo tema</Link>
                        </Button>
                    </div>
                </div>

                <form
                    className="flex max-w-md gap-2"
                    onSubmit={(event) => {
                        event.preventDefault();
                        router.get('/comunidades', { q: search || undefined, tag: filtros.tag ?? undefined });
                    }}
                >
                    <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar temas" />
                    <Button type="submit" variant="outline">
                        Buscar
                    </Button>
                </form>

                <FilterTabs options={options} active={filtros.tag} baseUrl="/comunidades" param="tag" />

                {temas.data.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">No hay temas publicados.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {temas.data.map((tema) => (
                            <ForumTopicCard
                                key={tema.id}
                                topic={tema}
                                tags={etiquetas}
                                footer={
                                    <Button asChild>
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

IndexComunidades.layout = {
    breadcrumbs: [{ title: 'Comunidades', href: '/comunidades' }],
};
