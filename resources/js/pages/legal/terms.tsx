import { Head, Link } from '@inertiajs/react';

export default function Terms() {
    return (
        <div className="dark relative min-h-screen overflow-hidden bg-[#080a0b] text-white">
            <Head title="Términos y Condiciones" />
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
                        Términos y Condiciones
                    </h1>
                    <p className="text-sm text-white/60">
                        Última actualización: noviembre de 2026
                    </p>
                </header>

                <article className="flex flex-col gap-6 text-sm leading-relaxed text-white/80 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white">
                    <section className="flex flex-col gap-2">
                        <h2>1. Aceptación de los Términos</h2>
                        <p>
                            Al acceder y utilizar esta plataforma, aceptas los
                            presentes Términos y Condiciones. Si no estás de
                            acuerdo con ellos, te pedimos no utilizar el
                            servicio.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>2. Descripción del Servicio</h2>
                        <p>
                            La plataforma es una comunidad científica que ofrece
                            bolsa de empleo, congresos y actividades, comunidades
                            (foros), papers y recursos, y un canal de contacto.
                            El servicio se presta con fines de colaboración y
                            difusión del conocimiento.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>3. Registro y Cuenta de Usuario</h2>
                        <p>
                            Para usar ciertas funciones debes crear una cuenta
                            con datos verídicos y mantener la confidencialidad de
                            tus credenciales. Eres responsable de toda actividad
                            que ocurra bajo tu cuenta.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>4. Uso Aceptable</h2>
                        <p>
                            Te comprometes a no publicar contenido ilegal,
                            ofensivo, difamatorio, discriminatorio o que vulnere
                            derechos de terceros. Tampoco está permitido el spam,
                            la suplantación de identidad ni el uso del servicio
                            para fines ajenos a los de la comunidad.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>5. Contenido Generado por el Usuario</h2>
                        <p>
                            El contenido que publiques (empleos, temas del foro,
                            papers, actividades, entre otros) es de tu
                            responsabilidad. La administración puede moderar,
                            editar o retirar contenido que incumpla estos
                            términos o las normas de la comunidad.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>6. Actividades, Congresos y Empleos</h2>
                        <p>
                            Las actividades, congresos y ofertas de empleo
                            publicados pasan por un proceso de moderación. La
                            plataforma no garantiza la veracidad, calidad ni la
                            celebración efectiva de los eventos o contrataciones
                            publicadas por terceros.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>7. Propiedad Intelectual</h2>
                        <p>
                            Los contenidos y el diseño de la plataforma están
                            protegidos por las leyes de propiedad intelectual.
                            No se autoriza su reproducción, distribución o uso
                            comercial sin consentimiento previo.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>8. Limitación de Responsabilidad</h2>
                        <p>
                            La plataforma se entrega &ldquo;tal cual&rdquo;, sin
                            garantías de disponibilidad continua. No nos hacemos
                            responsables por daños derivados del uso del
                            servicio, de la interacción entre usuarios ni del
                            contenido publicado por terceros.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>9. Modificaciones</h2>
                        <p>
                            Podemos actualizar estos términos en cualquier
                            momento. Los cambios serán publicados en esta página
                            y se entenderán aceptados si continúas usando la
                            plataforma.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>10. Ley Aplicable y Jurisdicción</h2>
                        <p>
                            Estos términos se rigen por la legislación de la
                            República de Chile. Cualquier controversia se
                            someterá a los tribunales de justicia competentes.
                        </p>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>11. Contacto</h2>
                        <p>
                            Para consultas sobre estos términos, puedes
                            escribirnos a través del formulario de contacto
                            disponible en la plataforma.
                        </p>
                    </section>
                </article>
            </div>
        </div>
    );
}
