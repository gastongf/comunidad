import { Head } from '@inertiajs/react';
import { PublicNavbar } from '@/components/public-navbar';

const directorio = [
    {
        cargo: 'Presidenta',
        nombre: 'Lucía Soto Salas',
        formacion: 'Bioquímica',
        foto: '/images/directorio/lucia.jpeg',
    },
    {
        cargo: 'Vicepresidente',
        nombre: 'Jonathan Fortt Ahumada',
        formacion: 'Biotecnólogo, Dr. en Ciencias mención Geología',
        foto: '/images/directorio/jonathan.jpeg',
    },
    {
        cargo: 'Director Ejecutivo',
        nombre: 'Francisco Sepúlveda E.',
        formacion: 'Bioquímico, MSc en Biología Molecular',
        foto: '/images/directorio/francisco.jpeg',
    },
    {
        cargo: 'Secretaria',
        nombre: 'Rocío Araya Osorio',
        formacion: 'Bioquímica / Doctorante Química',
        foto: '/images/directorio/rocio.jpeg',
    },
    {
        cargo: 'Tesorero',
        nombre: 'Yerko Riquelme Cubillos',
        formacion: 'Bioingeniero en Bioprocesos',
        foto: '/images/directorio/yerko.jpeg',
    },
    {
        cargo: 'Director de Bienestar y Convivencia',
        nombre: 'Gaspar Rojas Muñoz',
        formacion: 'Químico, Dr(c). en Química',
        foto: '/images/directorio/gaspar.jpeg',
    },
];

const pilares = [
    'Bolsa de Empleo Científica simplificada',
    'Foro de Comunidad por áreas disciplinarias',
    'Cartelera de Ciencia Accesible con beneficios para nuestros inscritos',
    'Red solidaria de intercambio de literatura científica',
];

export default function Nosotros() {
    return (
        <div className="dark relative min-h-screen overflow-hidden bg-[#080a0b] text-white">
            <Head title="Nosotros" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(54,130,111,0.2),transparent_38%),radial-gradient(ellipse_at_15%_85%,rgba(70,80,145,0.16),transparent_35%)]" />
            <PublicNavbar landing />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-20 p-4 pt-28 pb-20">
                <header className="flex flex-col gap-4">
                    <p className="flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-emerald-100/55 sm:text-sm">
                        <span className="h-px w-9 bg-emerald-200/50" />
                        ONG · RED COLABORATIVA DE INVESTIGADORES Y PROFESIONALES
                    </p>
                    <h1 className="font-heading text-4xl leading-tight font-medium tracking-tight sm:text-5xl lg:text-6xl">
                        Nosotros
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                        Somos una organización sin fines de lucro conformada por
                        investigadores y profesionales de las ciencias en Chile,
                        dedicada a conectar talento científico, democratizar el
                        acceso al conocimiento y generar oportunidades reales de
                        desarrollo laboral y formativo.
                    </p>
                </header>

                <section className="flex flex-col gap-6">
                    <p className="font-mono text-xs tracking-[0.18em] text-emerald-100/55">
                        01
                    </p>
                    <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                        Nuestra Misión
                    </h2>
                    <p className="max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
                        Articular una comunidad abierta, colaborativa y solidaria
                        que conecte a científicos, estudiantes e instituciones en
                        Chile, facilitando la inserción laboral en Industria,
                        Academia, Salud y Docencia, y promoviendo el acceso
                        equitativo a oportunidades científicas.
                    </p>
                </section>

                <section className="flex flex-col gap-6">
                    <p className="font-mono text-xs tracking-[0.18em] text-emerald-100/55">
                        02
                    </p>
                    <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                        Nuestra Visión
                    </h2>
                    <p className="max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
                        Consolidarnos como la principal plataforma comunitaria
                        para la ciencia en Chile, donde cada investigador o
                        profesional encuentre apoyo mutuo, difusión de Ciencia
                        Accesible, colaboración interdisciplinaria y vinculación
                        efectiva con el medio productivo y académico.
                    </p>
                </section>

                <section className="flex flex-col gap-6">
                    <p className="font-mono text-xs tracking-[0.18em] text-emerald-100/55">
                        03
                    </p>
                    <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                        Nuestros Pilares
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {pilares.map((pilar, index) => (
                            <div
                                key={pilar}
                                className="flex items-start gap-4 border border-white/10 bg-white/[0.025] p-5"
                            >
                                <span className="font-mono text-xs text-emerald-100/45">
                                    0{index + 1}
                                </span>
                                <p className="text-sm leading-6 text-white/70">
                                    {pilar}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <p className="font-mono text-xs tracking-[0.18em] text-emerald-100/55">
                            LIDERAZGO Y GOBERNANZA
                        </p>
                        <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                            Directorio
                        </h2>
                        <p className="text-sm text-white/55">
                            Conoce a las socias y socios fundadores que encabezan
                            nuestra organización.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {directorio.map((miembro) => (
                            <div
                                key={miembro.nombre}
                                className="overflow-hidden border border-white/10 bg-white/[0.025] transition-colors hover:border-white/25 hover:bg-white/[0.05]"
                            >
                                <img
                                    src={miembro.foto}
                                    alt={miembro.nombre}
                                    className="aspect-[3/4] w-full object-cover"
                                />
                                <div className="flex flex-col gap-1.5 p-5">
                                    <span className="font-mono text-[11px] tracking-[0.14em] text-emerald-100/60 uppercase">
                                        {miembro.cargo}
                                    </span>
                                    <h3 className="text-lg font-medium tracking-tight">
                                        {miembro.nombre}
                                    </h3>
                                    <p className="text-sm leading-6 text-white/55">
                                        {miembro.formacion}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
