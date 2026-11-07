import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Instagram } from 'lucide-react';
import { GuestJobsList } from '@/components/guest-jobs-list';
import type { Paginated } from '@/components/job-pagination';
import type { JobPostingSummary } from '@/components/job-posting-card';
import { PublicNavbar } from '@/components/public-navbar';
import { dashboard, register } from '@/routes';
import type { Auth } from '@/types';

type WelcomePageProps = {
    auth: Auth;
};

const rotatingWords = ['aprende', 'conecta', 'participa', 'crece'];

const features = [
    {
        number: '01',
        id: 'empleo',
        title: 'Bolsa de empleo',
        description:
            'Encuentra oportunidades profesionales y conecta con organizaciones que valoran tu conocimiento.',
        link: '/empleos',
        linkLabel: 'Explorar empleos',
    },
    {
        number: '02',
        id: 'papers',
        title: 'Papers y recursos',
        description:
            'Comparte publicaciones, enlaces y recursos útiles para que el conocimiento llegue más lejos.',
        link: '#comunidad',
        linkLabel: 'Conocer la comunidad',
    },
    {
        number: '03',
        id: 'formacion',
        title: 'Cursos y congresos',
        description:
            'Mantente al día con cursos gratuitos, congresos y actividades para seguir aprendiendo.',
        link: '#comunidad',
        linkLabel: 'Sumarme',
    },
    {
        number: '04',
        id: 'comunidad',
        title: 'Comunidad científica',
        description:
            'Conoce a otros profesionales, intercambia experiencias y crea vínculos que impulsan nuevas ideas.',
        link: '#participar',
        linkLabel: 'Participar',
    },
];

const steps = [
    {
        number: '01',
        title: 'Crea tu espacio',
        description: 'Regístrate y cuéntale a la comunidad qué te interesa.',
    },
    {
        number: '02',
        title: 'Encuentra conexiones',
        description:
            'Explora oportunidades, recursos y actividades relevantes.',
    },
    {
        number: '03',
        title: 'Comparte y crece',
        description: 'Aporta tu experiencia y construye nuevas colaboraciones.',
    },
];

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
    const content = (
        <>
            <div className="mb-12 flex items-center justify-between">
                <span className="font-mono text-sm text-white/35">
                    {feature.number}
                </span>
                <span className="text-xl text-white/35 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                </span>
            </div>
            <h3 className="mb-4 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                {feature.title}
            </h3>
            <p className="mb-8 max-w-sm text-sm leading-7 text-white/55 sm:text-base">
                {feature.description}
            </p>
            <span className="inline-flex items-center gap-2 text-sm text-white/80">
                {feature.linkLabel}
                <span aria-hidden="true">→</span>
            </span>
        </>
    );

    const className =
        'group flex min-h-[290px] flex-col border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05] sm:p-8';

    return feature.link === '/empleos' ? (
        <Link id={feature.id} href={feature.link} className={className}>
            {content}
        </Link>
    ) : (
        <a id={feature.id} href={feature.link} className={className}>
            {content}
        </a>
    );
}

export default function Welcome({
    empleos,
}: {
    empleos?: Paginated<JobPostingSummary>;
}) {
    const { auth } = usePage<WelcomePageProps>().props;
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setWordIndex((current) => (current + 1) % rotatingWords.length);
        }, 2500);

        return () => window.clearInterval(interval);
    }, []);

    if (empleos) {
        return (
            <div className="dark relative min-h-screen overflow-hidden bg-[#080a0b] text-white">
                <Head title="Empleos" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(54,130,111,0.2),transparent_38%),radial-gradient(ellipse_at_15%_85%,rgba(70,80,145,0.16),transparent_35%)]" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
                        backgroundSize: '72px 72px',
                        maskImage:
                            'linear-gradient(to bottom, black, transparent 90%)',
                    }}
                />
                <PublicNavbar landing />
                <div className="relative z-10 pt-28">
                    <GuestJobsList empleos={empleos} />
                </div>
            </div>
        );
    }

    const accountHref = auth.user ? dashboard() : register();
    const accountLabel = auth.user
        ? 'Ir a mi espacio'
        : 'Unirme a la comunidad';

    return (
        <>
            <Head title="Comunidad Científica" />
            <PublicNavbar landing />
            <main className="overflow-x-hidden scroll-smooth bg-[#080a0b] text-white">
                <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-32 pb-12 sm:px-10 lg:px-16">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(54,130,111,0.2),transparent_38%),radial-gradient(ellipse_at_15%_85%,rgba(70,80,145,0.16),transparent_35%)]" />
                    <div
                        className="pointer-events-none absolute inset-0 opacity-50"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
                            backgroundSize: '72px 72px',
                            maskImage:
                                'linear-gradient(to bottom, black, transparent 90%)',
                        }}
                    />
                    <div className="relative z-10 mx-auto w-full max-w-[1400px]">
                        <div className="max-w-5xl">
                            <p className="mb-8 flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-white/55 sm:text-sm">
                                <span className="h-px w-9 bg-emerald-200/50" />
                                CONOCIMIENTO, OPORTUNIDADES Y COLABORACIÓN
                            </p>
                            <h1 className="font-heading text-[clamp(3rem,8vw,7.5rem)] leading-[0.96] font-medium tracking-[-0.06em] text-white">
                                Una comunidad
                                <br />
                                que comparte y
                                <br />
                                <span
                                    key={rotatingWords[wordIndex]}
                                    className="inline-block animate-in bg-gradient-to-r from-emerald-200 via-cyan-100 to-violet-200 bg-clip-text text-transparent duration-500 fade-in"
                                >
                                    {rotatingWords[wordIndex]}.
                                </span>
                            </h1>
                            <p className="mt-8 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                                Un punto de encuentro para profesionales de la
                                ciencia: conecta con personas, descubre
                                oportunidades y comparte lo que sabes.
                            </p>
                            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={accountHref}
                                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-medium text-[#080a0b] transition-colors hover:bg-emerald-100"
                                >
                                    {accountLabel}
                                    <span className="ml-3" aria-hidden="true">
                                        →
                                    </span>
                                </Link>
                                <Link
                                    href="/empleos"
                                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-7 text-sm text-white transition-colors hover:border-white/50 hover:bg-white/5"
                                >
                                    Ver oportunidades
                                </Link>
                            </div>
                        </div>

                        <div className="mt-20 grid grid-cols-2 gap-6 border-t border-white/15 pt-6 sm:grid-cols-4 sm:gap-8">
                            {[
                                'Oportunidades',
                                'Investigación',
                                'Formación',
                                'Colaboración',
                            ].map((item, index) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >
                                    <span className="font-mono text-xs text-emerald-100/45">
                                        0{index + 1}
                                    </span>
                                    <span className="text-xs text-white/60 sm:text-sm">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <a
                        href="#explorar"
                        className="absolute right-8 bottom-12 hidden items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-white/40 lg:flex"
                    >
                        DESLIZA PARA EXPLORAR
                        <span className="text-base" aria-hidden="true">
                            ↓
                        </span>
                    </a>
                </section>

                <section
                    id="explorar"
                    className="border-t border-white/10 bg-[#0b0e10] px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
                >
                    <div className="mx-auto max-w-[1400px]">
                        <div className="mb-14 flex flex-col justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
                            <div>
                                <p className="mb-5 font-mono text-xs tracking-[0.18em] text-emerald-100/55">
                                    UN ESPACIO PARA CADA IDEA
                                </p>
                                <h2 className="max-w-3xl font-heading text-4xl leading-tight font-medium tracking-tight sm:text-5xl lg:text-6xl">
                                    Todo lo que necesitas para avanzar.
                                </h2>
                            </div>
                            <p className="max-w-md text-sm leading-7 text-white/55 sm:text-base">
                                Encuentra recursos y personas que te acercan a
                                lo que quieres construir en tu camino
                                científico.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {features.map((feature) => (
                                <FeatureCard
                                    key={feature.number}
                                    feature={feature}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative overflow-hidden border-t border-white/10 px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
                    <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-emerald-200/[0.04] blur-[120px]" />
                    <div className="relative mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
                        <div>
                            <p className="mb-5 font-mono text-xs tracking-[0.18em] text-emerald-100/55">
                                ASÍ FUNCIONA
                            </p>
                            <h2 className="font-heading text-5xl leading-[1.02] font-medium tracking-tight sm:text-6xl">
                                Del interés
                                <br />
                                al impacto.
                            </h2>
                            <p className="mt-7 max-w-md text-base leading-7 text-white/55">
                                Una comunidad abierta crece con cada persona que
                                participa, pregunta y comparte.
                            </p>
                        </div>

                        <div className="divide-y divide-white/10 border-y border-white/10">
                            {steps.map((step) => (
                                <div
                                    key={step.number}
                                    className="grid gap-3 py-7 sm:grid-cols-[64px_1fr] sm:gap-6 sm:py-8"
                                >
                                    <span className="font-mono text-sm text-emerald-100/45">
                                        {step.number}
                                    </span>
                                    <div>
                                        <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                                            {step.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-white/50 sm:text-base">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    id="participar"
                    className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
                >
                    <div className="relative mx-auto max-w-[1400px] overflow-hidden border border-white/15 bg-[#0d1112] px-7 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
                        <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-cyan-200/[0.07] blur-[100px]" />
                        <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
                            <div className="max-w-3xl">
                                <p className="mb-5 font-mono text-xs tracking-[0.18em] text-emerald-100/55">
                                    EL SIGUIENTE PASO ES TUYO
                                </p>
                                <h2 className="font-heading text-4xl leading-tight font-medium tracking-tight sm:text-5xl lg:text-6xl">
                                    La ciencia avanza mejor cuando se comparte.
                                </h2>
                                <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                                    Súmate a una comunidad que conecta
                                    conocimiento con nuevas posibilidades.
                                </p>
                            </div>
                            <Link
                                href={accountHref}
                                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-white px-7 text-sm font-medium text-[#080a0b] transition-colors hover:bg-emerald-100"
                            >
                                {accountLabel}
                                <span className="ml-3" aria-hidden="true">
                                    →
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                <footer className="border-t border-white/10 px-6 py-8 sm:px-10 lg:px-16">
                    <div className="mx-auto flex max-w-[1400px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-1.5">
                            <Link
                                href="/"
                                className="text-sm font-semibold tracking-[0.06em]"
                            >
                                ONG Comunidad Científica de Chile
                            </Link>
                            <p className="text-xs text-white/50">
                                Un espacio para conectar, compartir y colaborar
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/50">
                            <Link
                                href="/nosotros"
                                className="transition-colors hover:text-white"
                            >
                                Nosotros
                            </Link>
                            <Link
                                href="/empleos"
                                className="transition-colors hover:text-white"
                            >
                                Empleos
                            </Link>
                            <a
                                href="#papers"
                                className="transition-colors hover:text-white"
                            >
                                Papers y recursos
                            </a>
                            <a
                                href="#formacion"
                                className="transition-colors hover:text-white"
                            >
                                Formación
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://www.instagram.com/comunidadcientificachile/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="text-white/50 transition-colors hover:text-white"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <p className="text-xs text-white/35">
                                © {new Date().getFullYear()} Comunidad Científica
                            </p>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
