import { Form, Head } from "@inertiajs/react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/routes";
import { store } from "@/routes/register";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FieldLabel } from "@/components/ui/field";
import React from 'react';

type Career = {
    id: number;
    career_category_id: number;
    name: string;
};

type CareerCategory = {
    id: number;
    name: string;
    careers: Career[];
};

type Props = {
    passwordRules: string;
    categorias: CareerCategory[];
};

export default function Register({ passwordRules, categorias }: Props) {
    return (
        <>
            <Head title="Registro" />
            <Form
                {...store.form()}
                resetOnSuccess={["password", "password_confirmation"]}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nombre completo"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <FieldLabel htmlFor="career_id">
                                    Carrera o Profesión
                                </FieldLabel>
                                <Select name="career_id" defaultValue="">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona una carrera" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {categorias.map((category, index) => (
                                            <React.Fragment key={category.id}>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        {category.name}
                                                    </SelectLabel>

                                                    {category.careers.map(
                                                        (career) => (
                                                            <SelectItem
                                                                key={career.id}
                                                                value={String(
                                                                    career.id,
                                                                )}
                                                            >
                                                                {career.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>

                                                {index <
                                                    categorias.length - 1 && (
                                                    <SelectSeparator />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.career_id && (
                                    <InputError
                                        message={"Debe seleccionar una carrera o profesión."}
                                    />
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Contraseña"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar contraseña
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirmar contraseña"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-2.5">
                                    <Checkbox
                                        id="terms"
                                        name="terms"
                                        required
                                        tabIndex={5}
                                        className="mt-0.5"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <label
                                            htmlFor="terms"
                                            className="text-sm leading-relaxed text-muted-foreground"
                                        >
                                            Acepto los{' '}
                                            <TextLink href="/terminos-y-condiciones">
                                                Términos y Condiciones
                                            </TextLink>
                                        </label>
                                        <InputError message={errors.terms} />
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <Checkbox
                                        id="privacy"
                                        name="privacy"
                                        required
                                        tabIndex={6}
                                        className="mt-0.5"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <label
                                            htmlFor="privacy"
                                            className="text-sm leading-relaxed text-muted-foreground"
                                        >
                                            Acepto la{' '}
                                            <TextLink href="/politica-de-privacidad">
                                                Política de Privacidad
                                            </TextLink>{' '}
                                            y el tratamiento de mis datos personales
                                            conforme a la Ley N° 21.719 de Protección
                                            de Datos Personales.
                                        </label>
                                        <InputError message={errors.privacy} />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={7}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Crear cuenta
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            ¿Ya tienes una cuenta?{" "}
                            <TextLink href={login()} tabIndex={8}>
                                Inicia sesión
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: "Crear una cuenta",
    description: "Ingresa tus datos para crear tu cuenta",
};
