import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export type Region = { id: number; name: string };

export type EmpresaForm = {
    id: number;
    name: string;
    rut: string;
    website: string | null;
    description: string | null;
    region_id: number | null;
    status: 'active' | 'inactive';
    owner?: { name: string; email: string } | null;
};

export function EmpresaFormFields({
    action,
    method,
    regions,
    empresa,
    submitLabel,
    hideStatus = false,
}: {
    action: string;
    method: 'post' | 'put';
    regions: Region[];
    empresa?: EmpresaForm;
    submitLabel: string;
    hideStatus?: boolean;
}) {
    const isEdit = Boolean(empresa);

    return (
        <Form
            action={action}
            method={method}
            encType="multipart/form-data"
            disableWhileProcessing
            className="space-y-8 inert:pointer-events-none inert:opacity-50"
        >
            {({ errors }) => (
                <FieldGroup>
                    <FieldSet>
                        <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {isEdit ? (
                                <Field>
                                    <FieldLabel>Usuario propietario</FieldLabel>
                                    <Input
                                        value={`${empresa?.owner?.name ?? ''} (${empresa?.owner?.email ?? ''})`}
                                        disabled
                                    />
                                </Field>
                            ) : (
                                <>
                                    <Field>
                                        <FieldLabel htmlFor="name_user">Nombre Usuario</FieldLabel>
                                        <Input id="name_user" name="name_user" placeholder="Juan Perez" required />
                                        <FieldError>{errors.name_user}</FieldError>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                                        <Input id="email" name="email" type="email" placeholder="juan.perez@example.com" required />
                                        <FieldError>{errors.email}</FieldError>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                                        <Input id="password" name="password" type="password" required />
                                        <FieldError>{errors.password}</FieldError>
                                    </Field>
                                </>
                            )}
                            <Field>
                                <FieldLabel htmlFor="name_company">Nombre Empresa</FieldLabel>
                                <Input id="name_company" name="name_company" defaultValue={empresa?.name} placeholder="Empresa Ejemplo S.A." required />
                                <FieldError>{errors.name_company}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="rut">RUT de la empresa</FieldLabel>
                                <Input id="rut" name="rut" defaultValue={empresa?.rut} placeholder="12345678-9" required />
                                <FieldError>{errors.rut}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="region_id">Región</FieldLabel>
                                <Select name="region_id" defaultValue={empresa?.region_id?.toString()}>
                                    <SelectTrigger id="region_id" className="w-full">
                                        <SelectValue placeholder="Seleccione región" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.region_id}</FieldError>
                            </Field>
                            {!hideStatus && (
                            <Field>
                                <FieldLabel htmlFor="status">Estado</FieldLabel>
                                <Select name="status" defaultValue={empresa?.status ?? 'active'}>
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Activa</SelectItem>
                                        <SelectItem value="inactive">Inactiva</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.status}</FieldError>
                            </Field>
                            )}
                            <Field>
                                <FieldLabel htmlFor="website">Sitio Web (opcional)</FieldLabel>
                                <Input id="website" name="website" defaultValue={empresa?.website ?? ''} placeholder="https://www.empresa-ejemplo.cl" />
                                <FieldError>{errors.website}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="logo">Logo (opcional)</FieldLabel>
                                <Input id="logo" name="logo" type="file" accept="image/*" />
                                <FieldDescription>Imagen de hasta 2 MB.</FieldDescription>
                                <FieldError>{errors.logo}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="description">Descripción (opcional)</FieldLabel>
                                <Textarea id="description" name="description" defaultValue={empresa?.description ?? ''} placeholder="Descripción de la empresa" className="resize-none" />
                                <FieldError>{errors.description}</FieldError>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">{submitLabel}</Button>
                    </Field>
                </FieldGroup>
            )}
        </Form>
    );
}
