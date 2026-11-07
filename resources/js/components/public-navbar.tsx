import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import type { Auth } from '@/types';

type PublicPageProps = {
    auth: Auth;
};

const landingLinks = [
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Empleos', href: '/empleos' },
    { label: 'Papers y recursos', href: '/papers' },
    { label: 'Cursos y congresos', href: '/actividades' },
    { label: 'Comunidad', href: '/comunidades' },
];

export function PublicNavbar({ landing = false }: { landing?: boolean }) {
    const {
        props: { auth },
        url,
    } = usePage<PublicPageProps>();
    const isHome = url.split('?')[0] === '/';
    const links = landingLinks.map((item) =>
        item.href.startsWith('#') && !isHome ? { ...item, href: `/${item.href}` } : item,
    );
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!landing) {
            return;
        }

        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [landing]);

    if (landing) {
        return (
            <header className="fixed top-4 right-4 left-4 z-50">
                <nav
                    className={`relative z-50 mx-auto max-w-[1200px] rounded-2xl border transition-all duration-300 ${
                        isScrolled || isMobileMenuOpen
                            ? 'border-white/10 bg-[#090b0d]/90 shadow-2xl shadow-black/20 backdrop-blur-xl'
                            : 'border-transparent bg-transparent'
                    }`}
                >
                    <div className="flex h-16 items-center justify-between px-5 sm:px-7">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/images/logo.png?v=3"
                                alt="Comunidad Científica de Chile"
                                className="h-[56px] w-auto sm:h-[62px]"
                            />
                        </Link>

                        <div className="hidden items-center gap-8 md:flex">
                            {links.map((item) =>
                                item.href === '/empleos' ? (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="text-sm text-white/65 transition-colors hover:text-white"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="text-sm text-white/65 transition-colors hover:text-white"
                                    >
                                        {item.label}
                                    </a>
                                ),
                            )}
                        </div>

                        <div className="hidden items-center gap-5 md:flex">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/85"
                                >
                                    Ir a mi espacio
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm text-white/70 transition-colors hover:text-white"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/85"
                                    >
                                        Registrarme
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full text-white md:hidden"
                            aria-label={
                                isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'
                            }
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span
                                className={`h-px w-5 bg-current transition-transform ${
                                    isMobileMenuOpen
                                        ? 'translate-y-[4px] rotate-45'
                                        : ''
                                }`}
                            />
                            <span
                                className={`h-px w-5 bg-current transition-transform ${
                                    isMobileMenuOpen
                                        ? '-translate-y-[4px] -rotate-45'
                                        : ''
                                }`}
                            />
                        </button>
                    </div>
                </nav>

                <div
                    className={`fixed inset-0 z-40 flex flex-col bg-[#080a0b] px-8 pt-28 pb-8 transition-all duration-300 md:hidden ${
                        isMobileMenuOpen
                            ? 'visible opacity-100'
                            : 'pointer-events-none invisible opacity-0'
                    }`}
                >
                    <div className="flex flex-1 flex-col justify-center gap-7">
                        {links.map((item) =>
                            item.href === '/empleos' ? (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-3xl font-medium tracking-tight text-white"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-3xl font-medium tracking-tight text-white"
                                >
                                    {item.label}
                                </a>
                            ),
                        )}
                    </div>
                    <div className="flex gap-3 border-t border-white/10 pt-6">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="flex-1 rounded-full bg-white px-5 py-3 text-center text-sm font-medium text-black"
                            >
                                Ir a mi espacio
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="flex-1 rounded-full border border-white/20 px-5 py-3 text-center text-sm text-white"
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href={register()}
                                    className="flex-1 rounded-full bg-white px-5 py-3 text-center text-sm font-medium text-black"
                                >
                                    Registrarme
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="w-full border-b bg-[#FDFDFC] dark:bg-[#0a0a0a]">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/nosotros">Nosotros</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/empleos">Empleos</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex items-center gap-2">
                    {auth.user ? (
                        <Button asChild variant="outline" size="sm">
                            <Link href={dashboard()}>Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={login()}>Iniciar sesión</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href={register()}>Registrarse</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
