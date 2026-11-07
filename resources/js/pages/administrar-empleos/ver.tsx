import { Form, Head, Link, router } from "@inertiajs/react";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { dashboard } from "@/routes";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea"
import {Trash2Icon, X } from 'lucide-react';
export default function VerAdministrarEmpleos({
    trabajo,
}: {
    trabajo: any;
}) {
    console.log(trabajo);

    return (
        <>
            <Head title="Empleos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex gap-2 justify-end">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                Rechazar Empleo
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                    <X />
                                </AlertDialogMedia>
                                <AlertDialogTitle>
                                    Rechazar Empleo
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Indica el motivo del rechazo. Este mensaje
                                    se enviará al usuario.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Form
                                action={`/administrar-empleos/rechazar`}
                                method="post"
                            >
                                {({ errors }) => (
                                    <>
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={trabajo.id}
                                        />
                                        <FieldGroup>
                                            <FieldSet>
                                                <FieldGroup>
                                                    <Field
                                                        data-invalid={
                                                            errors.motivo
                                                                ? "true"
                                                                : "false"
                                                        }
                                                    >
                                                        <FieldLabel htmlFor="motivo">
                                                            Motivo
                                                        </FieldLabel>
                                                        <Textarea
                                                            aria-invalid={
                                                                errors.motivo
                                                                    ? "true"
                                                                    : "false"
                                                            }
                                                            id="motivo"
                                                            name="motivo"
                                                            placeholder="Escribe el motivo del rechazo"
                                                            className="resize-none"
                                                        />
                                                        {errors.motivo && (
                                                            <FieldDescription>
                                                                Por favor
                                                                ingresa el
                                                                motivo del
                                                                rechazo.
                                                            </FieldDescription>
                                                        )}
                                                    </Field>
                                                </FieldGroup>
                                            </FieldSet>
                                        </FieldGroup>
                                        <AlertDialogFooter className="mt-4">
                                            <AlertDialogCancel variant="outline">
                                                Cancelar
                                            </AlertDialogCancel>
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                            >
                                                Rechazar
                                            </Button>
                                        </AlertDialogFooter>
                                    </>
                                )}
                            </Form>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button onClick={() => router.post('/administrar-empleos/aprobar', { id: trabajo.id })}>Aprobar Empleo</Button>
                </div>
            </div>
        </>
    );
}

VerAdministrarEmpleos.layout = {
    breadcrumbs: [
        {
            title: "Administrar Empleos",
            href: "/administrar-empleos",
        },
        {
            title: "Ver Empleo",
        },
    ],
};
