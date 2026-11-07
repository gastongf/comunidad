import { Form, Head, Link } from '@inertiajs/react';
import type { ForumTopicSummary } from '@/components/forum-topic-card';
import { ModerationStatusBadge } from '@/components/moderation-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

type Reply = {
    id: number;
    content: string;
    created_at: string;
    author?: { id: number; name: string } | null;
};

type Props = {
    tema: ForumTopicSummary & { replies: Reply[] };
    etiquetas: Record<string, string>;
    puedeResponder: boolean;
};

export default function VerTema({ tema, etiquetas, puedeResponder }: Props) {
    return (
        <>
            <Head title={tema.title} />
            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap gap-2">
                            {tema.status !== 'publicado' && <ModerationStatusBadge status={tema.status} />}
                            <Badge variant="secondary">{etiquetas[tema.tag] ?? tema.tag}</Badge>
                            {tema.is_closed && <Badge variant="secondary">Cerrado</Badge>}
                        </div>
                        <CardTitle className="text-xl font-bold">{tema.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {tema.author?.name} · {new Date(tema.created_at).toLocaleDateString('es-CL')} · {tema.views} vistas
                        </p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-line">{tema.content}</p>
                    </CardContent>
                </Card>

                <h2 className="text-sm font-semibold">Respuestas ({tema.replies.length})</h2>
                {tema.replies.map((reply) => (
                    <Card key={reply.id}>
                        <CardContent className="flex flex-col gap-1">
                            <p className="text-xs text-muted-foreground">
                                {reply.author?.name} · {new Date(reply.created_at).toLocaleDateString('es-CL')}
                            </p>
                            <p className="text-sm whitespace-pre-line">{reply.content}</p>
                        </CardContent>
                    </Card>
                ))}

                {puedeResponder && (
                    <Form
                        action={`/comunidades/${tema.id}/respuestas`}
                        method="post"
                        resetOnSuccess
                        disableWhileProcessing
                        className="flex flex-col gap-3 inert:opacity-50"
                    >
                        {({ errors, processing }) => (
                            <>
                                <Field>
                                    <FieldLabel htmlFor="content">Tu respuesta</FieldLabel>
                                    <Textarea id="content" name="content" rows={4} required />
                                    <FieldError>{errors.content}</FieldError>
                                </Field>
                                <div>
                                    <Button type="submit" disabled={processing}>
                                        Responder
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}

                <div>
                    <Button asChild variant="outline">
                        <Link href="/comunidades">Volver</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
