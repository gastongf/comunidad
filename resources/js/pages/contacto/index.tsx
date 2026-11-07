import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Contacto() {
    return (
        <>
            <Head title="Contacto" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Contacto</h1>
                    <p className="text-sm text-muted-foreground">
                        Escríbenos y el equipo de Comunidad Científica te responderá.
                    </p>
                </div>
                <Form
                    action="/contacto"
                    method="post"
                    resetOnSuccess
                    disableWhileProcessing
                    className="max-w-2xl space-y-6 inert:opacity-50"
                >
                    {({ errors, processing }) => (
                        <>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                                    <Input id="name" name="name" required />
                                    <FieldError>{errors.name}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                                    <Input id="email" name="email" type="email" required />
                                    <FieldError>{errors.email}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="subject">Asunto</FieldLabel>
                                    <Input id="subject" name="subject" required />
                                    <FieldError>{errors.subject}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="message">Mensaje</FieldLabel>
                                    <Textarea id="message" name="message" rows={6} required />
                                    <FieldError>{errors.message}</FieldError>
                                </Field>
                            </FieldGroup>
                            <Button type="submit" disabled={processing}>
                                Enviar mensaje
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Contacto.layout = {
    breadcrumbs: [{ title: 'Contacto', href: '/contacto' }],
};
