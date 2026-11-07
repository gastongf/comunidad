import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CrearActividad({ categorias }: { categorias: Record<string, string> }) {
    return (
        <>
            <Head title="Proponer actividad" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Proponer actividad</h1>
                    <p className="text-sm text-muted-foreground">
                        Tu propuesta será revisada por la administración antes de publicarse.
                    </p>
                </div>
                <Form
                    action="/actividades"
                    method="post"
                    disableWhileProcessing
                    className="space-y-8 inert:pointer-events-none inert:opacity-50"
                >
                    {({ errors, processing }) => (
                        <>
                            <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <Field>
                                    <FieldLabel htmlFor="title">Título</FieldLabel>
                                    <Input id="title" name="title" required />
                                    <FieldError>{errors.title}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel>Categoría</FieldLabel>
                                    <Select name="category" defaultValue="congresos">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(categorias).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.category}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel>Modalidad</FieldLabel>
                                    <Select name="modality" defaultValue="Online">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Online', 'Presencial', 'Híbrido'].map((value) => (
                                                <SelectItem key={value} value={value}>
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.modality}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="institution">Institución</FieldLabel>
                                    <Input id="institution" name="institution" />
                                    <FieldError>{errors.institution}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="event_date">Fecha del evento</FieldLabel>
                                    <Input id="event_date" name="event_date" type="date" />
                                    <FieldError>{errors.event_date}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel>Costo</FieldLabel>
                                    <Select name="is_free" defaultValue="1">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Gratuito</SelectItem>
                                            <SelectItem value="0">De pago</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.is_free}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="member_discount">Descuento para inscritos</FieldLabel>
                                    <Input id="member_discount" name="member_discount" placeholder="Ej: 20% socios" />
                                    <FieldError>{errors.member_discount}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="contact_or_link">Contacto o enlace</FieldLabel>
                                    <Input id="contact_or_link" name="contact_or_link" />
                                    <FieldError>{errors.contact_or_link}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="poster">Afiche (imagen)</FieldLabel>
                                    <Input id="poster" name="poster" type="file" accept="image/*" />
                                    <FieldError>{errors.poster}</FieldError>
                                </Field>
                            </FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="description">Descripción</FieldLabel>
                                <Textarea id="description" name="description" rows={6} required />
                                <FieldError>{errors.description}</FieldError>
                            </Field>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Enviar a revisión
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/actividades">Cancelar</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

CrearActividad.layout = {
    breadcrumbs: [
        { title: 'Congresos y actividades', href: '/actividades' },
        { title: 'Proponer', href: '/actividades/crear' },
    ],
};
