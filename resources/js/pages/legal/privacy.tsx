import { Head, Link } from '@inertiajs/react';

export default function Privacy() {
    return (
        <div className="dark relative min-h-screen overflow-hidden bg-[#080a0b] text-white">
            <Head title="Política de Privacidad" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(54,130,111,0.2),transparent_38%),radial-gradient(ellipse_at_15%_85%,rgba(70,80,145,0.16),transparent_35%)]" />
            <header className="fixed top-4 right-4 left-4 z-50">
                <div className="mx-auto max-w-[1200px] rounded-2xl border border-white/10 bg-[#090b0d]/90 backdrop-blur-xl">
                    <div className="flex h-16 items-center justify-center px-5">
                        <Link href="/" className="flex items-center gap-2 text-white">
                            <span className="text-lg font-semibold tracking-[0.16em] sm:text-xl">
                                COMUNIDAD
                            </span>
                            <span className="mt-1 text-[9px] font-medium tracking-[0.18em] text-white/45">
                                CIENTÍFICA
                            </span>
                        </Link>
                    </div>
                </div>
            </header>
            <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 pt-28 pb-16">
                <header className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Política de Privacidad
                    </h1>
                    <p className="text-sm text-white/60">
                        Última actualización: noviembre de 2026
                    </p>
                </header>

                <article className="flex flex-col gap-6 text-sm leading-relaxed text-white/80 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white">
                    <section className="flex flex-col gap-2">
                        <h2>1. Identificación del Responsable</h2>
                        <p>
                            Esta política regula el tratamiento de datos
                            personales realizado por la plataforma, en
                            conformidad con la Ley N° 21.719 sobre Protección de
                            Datos Personales de Chile y demás normativa
                            aplicable.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>2. Datos que Recopilamos</h2>
                        <p>
                            Recopilamos datos que nos proporcionas al
                            registrarte y usar la plataforma, tales como nombre,
                            correo electrónico, profesión o carrera, y los datos
                            que incluyas en tu perfil, postulaciones,
                            publicaciones o mensajes.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>3. Finalidades del Tratamiento</h2>
                        <p>
                            Tus datos se utilizan para: crear y gestionar tu
                            cuenta, permitir el funcionamiento de la comunidad
                            (empleos, actividades, foros, papers), moderar
                            contenidos, contactarte cuando sea necesario y
                            mejorar el servicio.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>4. Base Legal</h2>
                        <p>
                            El tratamiento se realiza sobre la base de tu
                            consentimiento libre, informado y específico, el que
                            otorgas al registrarte y aceptar esta política.
                            Podrás revocarlo en cualquier momento.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>5. Conservación de los Datos</h2>
                        <p>
                            Conservamos tus datos mientras tu cuenta esté activa
                            y durante el tiempo necesario para cumplir las
                            finalidades descritas o las obligaciones legales
                            aplicables.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>6. Derechos del Titular</h2>
                        <p>
                            En tu calidad de titular puedes ejercer los derechos
                            de acceso, rectificación, supresión, oposición,
                            portabilidad y limitación del tratamiento de tus
                            datos personales. Para ello, contáctanos a través de
                            los canales indicados al final de esta política.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>7. Comunicación a Terceros</h2>
                        <p>
                            No vendemos tus datos. Solo los compartimos cuando es
                            estrictamente necesario para el funcionamiento del
                            servicio o por requerimiento de autoridad competente,
                            conforme a la ley.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>8. Seguridad</h2>
                        <p>
                            Adoptamos medidas técnicas y organizativas para
                            proteger tus datos contra accesos no autorizados,
                            pérdida o alteración, de acuerdo al estado de la
                            técnica.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>9. Cookies</h2>
                        <p>
                            La plataforma puede utilizar cookies necesarias para
                            el correcto funcionamiento y la seguridad del
                            servicio, así como para recordar tus preferencias de
                            sesión.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>10. Modificaciones</h2>
                        <p>
                            Podemos actualizar esta política. Los cambios serán
                            publicados en esta página con su correspondiente
                            fecha de actualización.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>11. Contacto</h2>
                        <p>
                            Para ejercer tus derechos o resolver dudas sobre esta
                            política, escríbenos a través del formulario de
                            contacto de la plataforma.
                        </p>
                    </section>
                </article>
            </div>
        </div>
    );
}
