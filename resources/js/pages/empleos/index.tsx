import { Head, Link } from '@inertiajs/react';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { JobPostingCard } from '@/components/job-posting-card';
import type { JobPostingSummary } from '@/components/job-posting-card';
import { Button } from '@/components/ui/button';

export default function IndexEmpleos({ empleos }: { empleos: Paginated<JobPostingSummary> }) {
    return (
        <>
            <Head title="Empleos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1>Empleos</h1>
                    <p className="text-sm text-muted-foreground">
                        Explora las oportunidades publicadas.
                    </p>
                </div>

                {empleos.data.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                        No hay empleos publicados por el momento.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {empleos.data.map((empleo) => (
                            <JobPostingCard
                                key={empleo.id}
                                job={empleo}
                                footer={
                                    <Button asChild>
                                        <Link href={`/empleos/${empleo.id}`}>Ver detalle</Link>
                                    </Button>
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

IndexEmpleos.layout = {
    breadcrumbs: [
        {
            title: 'Empleos',
            href: '/empleos',
        },
    ],
};
