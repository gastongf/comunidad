import { Form, Head } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Info = {
    headline: string | null;
    profession: string | null;
    institution: string | null;
    region_id: number | null;
    city: string | null;
    postgrad_level: string | null;
    orcid: string | null;
    open_to_work: boolean;
    is_public: boolean;
} | null;

type Props = {
    info: Info;
    hasCv: boolean;
    regiones: { id: number; name: string }[];
    nivelesPostgrado: Record<string, string>;
};

const NONE = 'ninguno';

export default function PerfilProfesional({ info, hasCv, regiones, nivelesPostgrado }: Props) {
    return (
        <>
            <Head title="Perfil profesional" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Perfil profesional</h1>
                    <p className="text-sm text-muted-foreground">
                        Completa estos datos para poder postular a empleos. El postgrado y el ORCID son opcionales.
                    </p>
                </div>
                <Form
                    action="/perfil-profesional"
                    method="post"
                    disableWhileProcessing
                    className="space-y-8 inert:pointer-events-none inert:opacity-50"
                >
                    {({ errors, processing }) => (
                        <>
                            <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Field className="md:col-span-2">
                                    <FieldLabel htmlFor="headline">Titular profesional</FieldLabel>
                                    <Input id="headline" name="headline" defaultValue={info?.headline ?? ''} placeholder="Ej: Bioinformática especializada en genómica" />
                                    <FieldError>{errors.headline}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="profession">Profesión</FieldLabel>
                                    <Input id="profession" name="profession" defaultValue={info?.profession ?? ''} />
                                    <FieldError>{errors.profession}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="institution">Institución</FieldLabel>
                                    <Input id="institution" name="institution" defaultValue={info?.institution ?? ''} />
                                    <FieldError>{errors.institution}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel>Región</FieldLabel>
                                    <Select name="region_id" defaultValue={info?.region_id ? String(info.region_id) : undefined}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una región" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {regiones.map((region) => (
                                                <SelectItem key={region.id} value={String(region.id)}>
                                                    {region.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.region_id}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="city">Ciudad</FieldLabel>
                                    <Input id="city" name="city" defaultValue={info?.city ?? ''} />
                                    <FieldError>{errors.city}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel>Postgrado (opcional)</FieldLabel>
                                    <Select name="postgrad_level" defaultValue={info?.postgrad_level ?? NONE}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Sin postgrado</SelectItem>
                                            {Object.entries(nivelesPostgrado).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.postgrad_level}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="orcid">ORCID (opcional)</FieldLabel>
                                    <Input id="orcid" name="orcid" defaultValue={info?.orcid ?? ''} placeholder="0000-0000-0000-0000" maxLength={19} />
                                    <FieldError>{errors.orcid}</FieldError>
                                </Field>
                                <Field className="md:col-span-2">
                                    <FieldLabel htmlFor="cv">Currículum (PDF)</FieldLabel>
                                    <Input id="cv" name="cv" type="file" accept="application/pdf" />
                                    <FieldDescription>
                                        {hasCv ? 'Ya subiste un CV. Sube otro solo si quieres reemplazarlo.' : 'Máximo 5 MB.'}
                                    </FieldDescription>
                                    <FieldError>{errors.cv}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel>Disponible para trabajar</FieldLabel>
                                    <Select name="open_to_work" defaultValue={info?.open_to_work === false ? '0' : '1'}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Sí</SelectItem>
                                            <SelectItem value="0">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel>Perfil público</FieldLabel>
                                    <Select name="is_public" defaultValue={info?.is_public === false ? '0' : '1'}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Sí</SelectItem>
                                            <SelectItem value="0">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </FieldGroup>
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive">
                                    <AlertTitle>Revisa el formulario</AlertTitle>
                                    <AlertDescription>Hay campos obligatorios sin completar o con errores.</AlertDescription>
                                </Alert>
                            )}
                            <Button type="submit" disabled={processing}>
                                Guardar perfil
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

PerfilProfesional.layout = {
    breadcrumbs: [{ title: 'Perfil profesional', href: '/perfil-profesional' }],
};
