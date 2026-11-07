import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FilterTabs } from '@/components/filter-tabs';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Paper = {
    id: number;
    type: 'solicitud' | 'aporte';
    title: string;
    authors_or_journal: string | null;
    scientific_area: string;
    doi_or_link: string | null;
    comment: string | null;
    contributed_by: string | null;
    user?: { id: number; name: string } | null;
};

const typeOptions = [
    { value: null, label: 'Todos' },
    { value: 'solicitud', label: 'Solicitudes' },
    { value: 'aporte', label: 'Aportes' },
];

function ContributeForm({ paper }: { paper: Paper }) {
    const [link, setLink] = useState('');

    return (
        <form
            className="flex w-full gap-2"
            onSubmit={(event) => {
                event.preventDefault();
                router.patch(`/papers/${paper.id}/aportar`, { doi_or_link: link }, { preserveScroll: true });
            }}
        >
            <Input value={link} onChange={(event) => setLink(event.target.value)} placeholder="DOI o enlace" required />
            <Button type="submit">Aportar</Button>
        </form>
    );
}

export default function IndexPapers({
    papers,
    tipoActivo,
}: {
    papers: Paginated<Paper>;
    tipoActivo: string | null;
}) {
    return (
        <>
            <Head title="Papers y recursos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1>Papers y recursos</h1>
                    <p className="text-sm text-muted-foreground">
                        Solicita papers que necesitas o comparte los que ya tienes con la comunidad.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Publicar solicitud o aporte</CardTitle>
                    </CardHeader>
                    <div className="px-6">
                        <Form
                            action="/papers"
                            method="post"
                            resetOnSuccess
                            disableWhileProcessing
                            className="space-y-4 pb-6 inert:opacity-50"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <Field>
                                            <FieldLabel>Tipo</FieldLabel>
                                            <Select name="type" defaultValue="solicitud">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="solicitud">Solicito un paper</SelectItem>
                                                    <SelectItem value="aporte">Aporto un paper</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FieldError>{errors.type}</FieldError>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="title">Título</FieldLabel>
                                            <Input id="title" name="title" required />
                                            <FieldError>{errors.title}</FieldError>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="authors_or_journal">Autores o revista</FieldLabel>
                                            <Input id="authors_or_journal" name="authors_or_journal" />
                                            <FieldError>{errors.authors_or_journal}</FieldError>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="scientific_area">Área científica</FieldLabel>
                                            <Input id="scientific_area" name="scientific_area" required />
                                            <FieldError>{errors.scientific_area}</FieldError>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="doi_or_link">DOI o enlace (obligatorio al aportar)</FieldLabel>
                                            <Input id="doi_or_link" name="doi_or_link" />
                                            <FieldError>{errors.doi_or_link}</FieldError>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="requester_email">Correo de contacto</FieldLabel>
                                            <Input id="requester_email" name="requester_email" type="email" />
                                            <FieldError>{errors.requester_email}</FieldError>
                                        </Field>
                                    </FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="comment">Comentario</FieldLabel>
                                        <Textarea id="comment" name="comment" rows={3} />
                                        <FieldError>{errors.comment}</FieldError>
                                    </Field>
                                    <Button type="submit" disabled={processing}>
                                        Publicar
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                </Card>

                <FilterTabs options={typeOptions} active={tipoActivo} baseUrl="/papers" param="tipo" />

                {papers.data.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">No hay papers para mostrar.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {papers.data.map((paper) => (
                            <Card key={paper.id}>
                                <CardHeader>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge
                                            className={
                                                paper.type === 'solicitud'
                                                    ? 'border border-amber-200/60 bg-amber-50 text-amber-700'
                                                    : 'border border-green-200/60 bg-green-50 text-green-700'
                                            }
                                        >
                                            {paper.type === 'solicitud' ? 'SOLICITADO' : 'DISPONIBLE'}
                                        </Badge>
                                        <Badge variant="secondary">{paper.scientific_area}</Badge>
                                    </div>
                                    <CardTitle className="text-base font-bold">{paper.title}</CardTitle>
                                    {paper.authors_or_journal && (
                                        <p className="text-xs text-muted-foreground">{paper.authors_or_journal}</p>
                                    )}
                                    {paper.comment && <CardDescription>{paper.comment}</CardDescription>}
                                    <p className="text-xs text-muted-foreground">
                                        Publicado por {paper.user?.name}
                                        {paper.contributed_by && ` · Aportado por ${paper.contributed_by}`}
                                    </p>
                                </CardHeader>
                                <CardFooter>
                                    {paper.type === 'aporte' && paper.doi_or_link ? (
                                        <Button asChild variant="outline">
                                            <a href={paper.doi_or_link} target="_blank" rel="noopener noreferrer">
                                                Abrir recurso
                                            </a>
                                        </Button>
                                    ) : (
                                        <ContributeForm paper={paper} />
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                <JobPagination links={papers.links} />
            </div>
        </>
    );
}

IndexPapers.layout = {
    breadcrumbs: [{ title: 'Papers y recursos', href: '/papers' }],
};
