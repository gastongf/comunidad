import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CrearTema({ etiquetas }: { etiquetas: Record<string, string> }) {
    return (
        <>
            <Head title="Nuevo tema" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Nuevo tema</h1>
                    <p className="text-sm text-muted-foreground">
                        Tu tema será revisado por la administración antes de publicarse.
                    </p>
                </div>
                <Form
                    action="/comunidades"
                    method="post"
                    disableWhileProcessing
                    className="max-w-3xl space-y-6 inert:pointer-events-none inert:opacity-50"
                >
                    {({ errors, processing }) => (
                        <>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="title">Título</FieldLabel>
                                    <Input id="title" name="title" required />
                                    <FieldError>{errors.title}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel>Etiqueta</FieldLabel>
                                    <Select name="tag" defaultValue="debate">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(etiquetas).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.tag}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="content">Contenido</FieldLabel>
                                    <Textarea id="content" name="content" rows={8} required />
                                    <FieldError>{errors.content}</FieldError>
                                </Field>
                            </FieldGroup>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Enviar a revisión
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/comunidades">Cancelar</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

CrearTema.layout = {
    breadcrumbs: [
        { title: 'Comunidades', href: '/comunidades' },
        { title: 'Nuevo tema', href: '/comunidades/crear' },
    ],
};
