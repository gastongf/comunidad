import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Option = { id: number; name: string };

export type EmpleoFormData = {
    id: number;
    title: string;
    description: string;
    responsibilities: string;
    requeriments: string;
    employment_type: string;
    work_mode: string;
    salary_min: string | null;
    salary_max: string | null;
    category_id: number;
    region_id: number;
    commune_id: number | null;
    start_date: string;
    finish_date: string | null;
    status: string;
    rejection_reason: string | null;
};

const employmentTypes: Record<string, string> = {
    completa: 'Jornada completa',
    parcial: 'Jornada parcial',
    plazo_fijo: 'Plazo fijo',
    indefinido: 'Indefinido',
    honorarios: 'Honorarios',
    practica: 'Práctica',
};

const workModes: Record<string, string> = { presencial: 'Presencial', remoto: 'Remoto', hibrido: 'Híbrido' };

function SelectField({
    name,
    label,
    placeholder,
    options,
    defaultValue,
    error,
    onChange,
}: {
    name: string;
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    defaultValue?: string;
    error?: string;
    onChange?: (value: string) => void;
}) {
    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Select name={name} defaultValue={defaultValue} onValueChange={onChange}>
                <SelectTrigger id={name} className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FieldError>{error}</FieldError>
        </Field>
    );
}

export function EmpleoFormFields({
    action,
    method,
    categories,
    regions,
    communes,
    empleo,
    submitLabel,
}: {
    action: string;
    method: 'post' | 'put';
    categories: Option[];
    regions: Option[];
    communes: (Option & { region_id: number })[];
    empleo?: EmpleoFormData;
    submitLabel: string;
}) {
    const [regionId, setRegionId] = useState(empleo?.region_id?.toString() ?? '');
    const regionCommunes = communes.filter((commune) => commune.region_id.toString() === regionId);

    const textField = (name: keyof EmpleoFormData, label: string, errors: Record<string, string>, props = {}) => (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Input id={name} name={name} defaultValue={(empleo?.[name] as string | null) ?? ''} {...props} />
            <FieldError>{errors[name]}</FieldError>
        </Field>
    );

    const textArea = (name: keyof EmpleoFormData, label: string, errors: Record<string, string>) => (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Textarea id={name} name={name} rows={4} defaultValue={(empleo?.[name] as string | null) ?? ''} required />
            <FieldError>{errors[name]}</FieldError>
        </Field>
    );

    return (
        <Form action={action} method={method} disableWhileProcessing className="space-y-8 inert:pointer-events-none inert:opacity-50">
            {({ errors }) => (
                <FieldGroup>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {textField('title', 'Título del cargo', errors, { required: true })}
                        <SelectField
                            name="category_id"
                            label="Categoría"
                            placeholder="Seleccione categoría"
                            options={categories.map((c) => ({ value: c.id.toString(), label: c.name }))}
                            defaultValue={empleo?.category_id?.toString()}
                            error={errors.category_id}
                        />
                        <SelectField
                            name="employment_type"
                            label="Tipo de contrato"
                            placeholder="Seleccione tipo"
                            options={Object.entries(employmentTypes).map(([value, label]) => ({ value, label }))}
                            defaultValue={empleo?.employment_type}
                            error={errors.employment_type}
                        />
                        <SelectField
                            name="work_mode"
                            label="Modalidad"
                            placeholder="Seleccione modalidad"
                            options={Object.entries(workModes).map(([value, label]) => ({ value, label }))}
                            defaultValue={empleo?.work_mode}
                            error={errors.work_mode}
                        />
                        <SelectField
                            name="region_id"
                            label="Región"
                            placeholder="Seleccione región"
                            options={regions.map((r) => ({ value: r.id.toString(), label: r.name }))}
                            defaultValue={empleo?.region_id?.toString()}
                            error={errors.region_id}
                            onChange={setRegionId}
                        />
                        <div key={regionId}>
                            <SelectField
                                name="commune_id"
                                label="Comuna (opcional)"
                                placeholder="Seleccione comuna"
                                options={regionCommunes.map((c) => ({ value: c.id.toString(), label: c.name }))}
                                defaultValue={empleo?.region_id?.toString() === regionId ? empleo?.commune_id?.toString() : undefined}
                                error={errors.commune_id}
                            />
                        </div>
                        {textField('salary_min', 'Sueldo mínimo (opcional)', errors)}
                        {textField('salary_max', 'Sueldo máximo (opcional)', errors)}
                        {textField('start_date', 'Fecha de inicio', errors, {
                            type: 'date',
                            required: true,
                            defaultValue: empleo?.start_date?.slice(0, 10) ?? '',
                        })}
                        {textField('finish_date', 'Fecha de cierre (opcional)', errors, {
                            type: 'date',
                            defaultValue: empleo?.finish_date?.slice(0, 10) ?? '',
                        })}
                    </div>
                    {textArea('description', 'Descripción', errors)}
                    {textArea('responsibilities', 'Responsabilidades', errors)}
                    {textArea('requeriments', 'Requisitos', errors)}
                    <Field orientation="horizontal">
                        <Button type="submit">{submitLabel}</Button>
                    </Field>
                </FieldGroup>
            )}
        </Form>
    );
}
