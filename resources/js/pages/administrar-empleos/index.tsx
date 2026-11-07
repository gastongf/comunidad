import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { BriefcaseBusiness, House } from 'lucide-react';

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

type PaginationLink = {
  url: string;
  label: string;
  active: boolean;
  page: number;

}

type Pagination = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    last_page_url: string;
    next_page_url: string;
    data: TrabajoPendiente[];
    links: PaginationLink[];
};

type TrabajoPendiente = {
  id: number;
  title: string;
  description: string;
  employment_type: string;
  start_date: string;
  category: {
    id: number;
    name: string;
  };
  finish_date: string;
  salary_min: string;
  salary_max: string;
  work_mode: string;
  status: string;
  rejection_reason: string;
  requeriments: string;
  responsibilities: string;
  slug: string;
  created_at: string;
  updated_at: string;
  company_id: number;
  commune_id: number;
  region_id: number;
  posted_id: number;
  approved_by: number;
}


export default function IndexAdministrarEmpleos({trabajosPendientes}: {trabajosPendientes: Pagination}) {
  console.log(trabajosPendientes);
    return (
        <>
            <Head title="Empleos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Listado de Empleos Pendientes a Revisar</h1>
                        <p className="text-sm text-muted-foreground">
                            Aquí puedes ver todos los empleos registrados.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {trabajosPendientes.data.map((trabajo) => (
                        <Card key={trabajo.id}>
                            <CardHeader>
                                <Badge
                                    className={`inline-flex items-center ${trabajo.status === "pendiente" ? "bg-amber-50 border border-amber-200/60 text-amber-700" : trabajo.status === "rechazado" ? "bg-red-50 border border-red-200/60 text-red-700" : "bg-green-50 border border-green-200/60 text-green-700"} px-2 py-0.5 text-[11px] font-semibold`}
                                >
                                    {trabajo.status.toUpperCase()}
                                </Badge>
                                <CardTitle className="text-lg font-bold">
                                    {trabajo.title}
                                </CardTitle>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="inline-flex items-center gap-1  bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                        <BriefcaseBusiness />
                                        {trabajo.employment_type}
                                    </Badge>
                                    <Badge className="inline-flex items-center gap-1  bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                        <House />
                                        {trabajo.work_mode}
                                    </Badge>
                                    <Badge className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-1 text-xs font-medium">
                                        {trabajo.salary_min != null &&
                                        trabajo.salary_max != null
                                            ? `$${Number(trabajo.salary_min).toLocaleString("es-CL")} - $${Number(trabajo.salary_max).toLocaleString("es-CL")}`
                                            : trabajo.salary_min != null
                                              ? `Desde $${Number(trabajo.salary_min).toLocaleString("es-CL")}`
                                              : trabajo.salary_max != null
                                                ? `Hasta $${Number(trabajo.salary_max).toLocaleString("es-CL")}`
                                                : "No especificado"}
                                    </Badge>
                                    <Badge className="inline-flex items-center gap-1  bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-2 py-1 text-xs font-medium ">
                                        {trabajo.category?.name}
                                    </Badge>
                                </div>
                                <CardDescription className="mt-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1 mb-1">
                                        Descripción
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-200 text-[13px] leading-relaxed line-clamp-2">
                                        {trabajo.description}
                                    </p>
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className=" bg-slate-50/70 dark:bg-slate-800/10 ">
                                {trabajo.rejection_reason ? (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">
                                                Ver motivo de rechazo
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent size="sm">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Motivo de rechazo
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {trabajo.rejection_reason}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogAction variant="outline">
                                                    Confirmar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                ) : (
                                    <Link
                                        href={`/administrar-empleos/${trabajo.id}`}
                                    >
                                        <Button>Revisar para aprobar</Button>
                                    </Link>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div>
                    <Pagination>
                        <PaginationContent>
                            {trabajosPendientes.links.map((link, index) => {
                                if (index === 0) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationPrevious
                                                href={link.url ?? "#"}
                                                text="Anterior"
                                            />
                                        </PaginationItem>
                                    );
                                }

                                if (
                                    index ===
                                    trabajosPendientes.links.length - 1
                                ) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationNext
                                                href={link.url ?? "#"}
                                                text="Siguiente"
                                            />
                                        </PaginationItem>
                                    );
                                }

                                return (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href={link.url ?? "#"}
                                            isActive={link.active}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </>
    );
}

IndexAdministrarEmpleos.layout = {
    breadcrumbs: [
        {
            title: "Administrar Empleos",
            href: "/administrar-empleos",
        },
    ],
};
