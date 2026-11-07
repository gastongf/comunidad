import { Link } from '@inertiajs/react';
import { JobPagination } from '@/components/job-pagination';
import type { Paginated } from '@/components/job-pagination';
import { JobPostingCard } from '@/components/job-posting-card';
import type { JobPostingSummary } from '@/components/job-posting-card';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';

export function GuestJobsList({ empleos }: { empleos: Paginated<JobPostingSummary> }) {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4">
            <div>
                <h1 className="text-xl font-semibold">Empleos</h1>
                <p className="text-sm text-muted-foreground">
                    Inicia sesión o regístrate para ver el detalle completo de cada empleo.
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
                            locked
                            transparent
                            footer={
                                <Button asChild>
                                    <Link href={login()}>Postular</Link>
                                </Button>
                            }
                        />
                    ))}
                </div>
            )}

            <JobPagination links={empleos.links} />
        </div>
    );
}
