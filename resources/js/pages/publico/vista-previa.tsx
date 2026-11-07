import { Head, Link } from '@inertiajs/react';
import { Lock, MessageSquare } from 'lucide-react';
import { ActivityCard } from '@/components/activity-card';
import type { ActivitySummary } from '@/components/activity-card';
import { PublicNavbar } from '@/components/public-navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login, register } from '@/routes';

type PaperItem = {
    id: number;
    title: string;
    scientific_area: string;
    authors_or_journal: string | null;
    comment: string | null;
    user?: { name: string } | null;
};

type TopicItem = {
    id: number;
    title: string;
    content: string;
    tag: string;
    created_at: string;
    replies_count?: number;
    views: number;
    author?: { name: string } | null;
};

type Props = {
    seccion: 'papers' | 'actividades' | 'comunidades';
    items: PaperItem[] | ActivitySummary[] | TopicItem[];
    categorias?: Record<string, string>;
    etiquetas?: Record<string, string>;
};

const copy = {
    papers: {
        title: 'Papers solicitados',
        text: 'Estos son algunos papers que la comunidad está buscando. Inicia sesión para aportar uno.',
        action: 'Aportar',
    },
    actividades: {
        title: 'Cursos y congresos',
        text: 'Una muestra de las actividades publicadas. Inicia sesión para ver el detalle e inscribirte.',
        action: 'Ingresar',
    },
    comunidades: {
        title: 'Comunidad',
        text: 'Un adelanto de las conversaciones. Inicia sesión para leer los temas completos y comentar.',
        action: 'Ingresar para comentar',
    },
};

export default function VistaPrevia({ seccion, items, categorias = {}, etiquetas = {} }: Props) {
    const info = copy[seccion];
    const loginButton = (
        <Button asChild size="sm">
            <Link href={login()}>
                <Lock /> {info.action}
            </Link>
        </Button>
    );

    return (
        <div className="dark relative min-h-screen overflow-hidden bg-[#080a0b] text-white">
            <Head title={info.title} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(54,130,111,0.2),transparent_38%),radial-gradient(ellipse_at_15%_85%,rgba(70,80,145,0.16),transparent_35%)]" />
            <PublicNavbar landing />
            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 pt-28">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold">{info.title}</h1>
                        <p className="text-sm text-muted-foreground">{info.text}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={register()}>Crear cuenta</Link>
                    </Button>
                </div>

                {items.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                        No hay contenido publicado por el momento.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {seccion === 'papers' &&
                            (items as PaperItem[]).map((paper) => (
                                <Card key={paper.id} className="bg-transparent">
                                    <CardHeader className="flex-1">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-amber-100 text-amber-800">SOLICITADO</Badge>
                                            <Badge variant="secondary">{paper.scientific_area}</Badge>
                                        </div>
                                        <CardTitle className="text-base font-bold">{paper.title}</CardTitle>
                                        {paper.authors_or_journal && (
                                            <p className="text-xs text-muted-foreground">{paper.authors_or_journal}</p>
                                        )}
                                        {paper.comment && <CardDescription>{paper.comment}</CardDescription>}
                                    </CardHeader>
                                    <CardFooter className="justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            Publicado por {paper.user?.name}
                                        </span>
                                        {loginButton}
                                    </CardFooter>
                                </Card>
                            ))}

                        {seccion === 'actividades' &&
                            (items as ActivitySummary[]).map((activity) => (
                                <ActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    categories={categorias}
                                    footer={
                                        <div className="flex w-full flex-wrap gap-2">
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/actividades/${activity.id}`}>Ver detalle</Link>
                                            </Button>
                                            {loginButton}
                                        </div>
                                    }
                                />
                            ))}

                        {seccion === 'comunidades' &&
                            (items as TopicItem[]).map((topic) => (
                                <Card key={topic.id} className="bg-transparent">
                                    <CardHeader className="flex-1">
                                        <Badge variant="secondary" className="w-fit">
                                            {etiquetas[topic.tag] ?? topic.tag}
                                        </Badge>
                                        <CardTitle className="text-lg font-bold">{topic.title}</CardTitle>
                                        <p className="text-xs text-muted-foreground">
                                            {topic.author?.name} ·{' '}
                                            {new Date(topic.created_at).toLocaleDateString('es-CL')}
                                        </p>
                                        <CardDescription className="line-clamp-2">{topic.content}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="justify-between">
                                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                            <MessageSquare className="size-3" /> {topic.replies_count ?? 0} respuestas
                                        </span>
                                        {loginButton}
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
