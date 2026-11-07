import { Link } from "@inertiajs/react";
import {
    BookOpen,
    CalendarDays,
    FileText,
    FolderGit2,
    LayoutGrid,
    Mail,
    MessagesSquare,
    User,
} from "lucide-react";
import AppLogo from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import type { NavItem } from "@/types";
import { usePermissions } from "@/hooks/usePermissions";

export function AppSidebar() {
    const { can, hasAnyRole, hasRole } = usePermissions();
    const isAdministrativeRole = hasAnyRole(["SuperAdmin", "Administrador", "Empresa"]);
    const memberModules: NavItem[] = isAdministrativeRole
        ? []
        : [
            { title: "Congresos y actividades", href: "/actividades", icon: CalendarDays },
            { title: "Comunidades", href: "/comunidades", icon: MessagesSquare },
            { title: "Papers y recursos", href: "/papers", icon: FileText },
            { title: "Contacto", href: "/contacto", icon: Mail },
        ];
    const mainNavItems: NavItem[] = [
        {
            title: "Dashboard",
            href: dashboard(),
            icon: LayoutGrid,
        },
        (can("ver usuarios") ||
            can("crear usuarios") ||
            can("editar usuarios") ||
            can("eliminar usuarios")) && {
            title: "Usuarios",
            href: "/usuarios",
            icon: User,
        },
        (can("ver empresas") ||
            can("crear empresas") ||
            can("editar empresas") ||
            can("eliminar empresas")) && {
            title: "Empresas",
            href: "/empresas",
            icon: FolderGit2,
        },
        !isAdministrativeRole &&
            (can("ver empleos") ||
            can("crear empleos") ||
            can("editar empleos") ||
            can("eliminar empleos")) && {
            title: "Empleos",
            href: "/empleos",
            icon: BookOpen,
        },
        hasRole("Cientifico") && {
            title: "Perfil profesional",
            href: "/perfil-profesional",
            icon: User,
        },
        hasRole("Empresa") && can("mis empleos") && {
            title: "Mi Empresa",
            href: "/mi-empresa",
            icon: FolderGit2,
        },
        hasRole("Empresa") && can("mis empleos") && {
            title: "Mis Empleos",
            href: "/mis-empleos",
            icon: BookOpen,
        },
        (can("administrar empleos")) && {
            title: "Administrar Empleos",
            href: "/administrar-empleos",
            icon: BookOpen,
        },
        ...memberModules,
        can("moderar actividades") && {
            title: "Administrar Actividades",
            href: "/administrar-actividades",
            icon: CalendarDays,
        },
        can("moderar comunidades") && {
            title: "Administrar Comunidades",
            href: "/administrar-comunidades",
            icon: MessagesSquare,
        },
        can("ver mensajes de contacto") && {
            title: "Mensajes de contacto",
            href: "/mensajes-contacto",
            icon: Mail,
        },
    ].filter(Boolean) as NavItem[];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
