import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { JobPostingCard } from '@/components/job-posting-card';
import type { JobPostingSummary } from '@/components/job-posting-card';
import { Button } from '@/components/ui/button';

export default function IndexMisEmpleos({ empleos }: { empleos: Paginated<JobPostingSummary> }) {
    return (
        <>
            <Head title="Mis empleos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1>Mis empleos</h1>
                        <p className="text-sm text-muted-foreground">
                            Empleos publicados por tu empresa.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/mis-empleos/crear">
                            <Plus /> Nuevo empleo
                        </Link>
                    </Button>
                </div>

                {empleos.data.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                        Tu empresa aún no tiene empleos.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {empleos.data.map((empleo) => (
                            <JobPostingCard
                                key={empleo.id}
                                job={empleo}
                                showStatus
                                footer={
                                    <>
                                        <Button asChild>
                                            <Link href={`/mis-empleos/${empleo.id}`}>Ver detalle</Link>
                                        </Button>
                                        <Button asChild variant="outline">
                                            <Link href={`/mis-empleos/${empleo.id}/postulantes`}>
                                                Postulantes ({(empleo as { applications_count?: number }).applications_count ?? 0})
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline">
                                            <Link href={`/mis-empleos/${empleo.id}/editar`}>Editar</Link>
                                        </Button>
                                        {empleo.status === 'publicado' && (
                                            <Button variant="outline" onClick={() => router.patch(`/mis-empleos/${empleo.id}/cerrar`)}>
                                                Cerrar
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive">Eliminar</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar "{empleo.title}"?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Se eliminarán también sus postulaciones. Esta acción no se puede deshacer.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => router.delete(`/mis-empleos/${empleo.id}`)}>
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </>
                                }
                            />
                        ))}
                    </div>
                )}

                <JobPagination links={empleos.links} />
            </div>
        </>
    );
}

IndexMisEmpleos.layout = {
    breadcrumbs: [
        {
            title: 'Mis empleos',
            href: '/mis-empleos',
        },
    ],
};
