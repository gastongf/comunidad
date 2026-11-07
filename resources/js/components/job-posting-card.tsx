import { BriefcaseBusiness, House, Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export type JobPostingSummary = {
    id: number;
    title: string;
    description: string;
    employment_type: string;
    work_mode: string;
    salary_min: string | null;
    salary_max: string | null;
    status: string;
    category?: { id: number; name: string } | null;
    company?: { id: number; name: string } | null;
};

const statusStyles: Record<string, string> = {
    pendiente: 'bg-amber-50 border border-amber-200/60 text-amber-700',
    rechazado: 'bg-red-50 border border-red-200/60 text-red-700',
    publicado: 'bg-green-50 border border-green-200/60 text-green-700',
};

const formatSalary = (min: string | null, max: string | null): string => {
    const format = (value: string) => `$${Number(value).toLocaleString('es-CL')}`;

    if (min != null && max != null) {
        return `${format(min)} - ${format(max)}`;
    }

    if (min != null) {
        return `Desde ${format(min)}`;
    }

    if (max != null) {
        return `Hasta ${format(max)}`;
    }

    return 'No especificado';
};

type Props = {
    job: JobPostingSummary;
    showStatus?: boolean;
    locked?: boolean;
    transparent?: boolean;
    footer: ReactNode;
};

export function JobPostingCard({
    job,
    showStatus = false,
    locked = false,
    transparent = false,
    footer,
}: Props) {
    return (
        <Card
            className={
                transparent
                    ? 'border border-white/10 bg-white/[0.03] ring-0 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/[0.06]'
                    : undefined
            }
        >
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    {showStatus ? (
                        <Badge
                            className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold ${statusStyles[job.status] ?? statusStyles.publicado}`}
                        >
                            {job.status.toUpperCase()}
                        </Badge>
                    ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                            {job.company?.name}
                        </span>
                    )}
                    {locked && <Lock className="size-4 text-muted-foreground" />}
                </div>
                <CardTitle className="text-lg font-bold">{job.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                    <Badge className="inline-flex items-center gap-1 bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                        <BriefcaseBusiness />
                        {job.employment_type}
                    </Badge>
                    <Badge className="inline-flex items-center gap-1 bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                        <House />
                        {job.work_mode}
                    </Badge>
                    <Badge className={`inline-flex items-center gap-1 border px-2 py-1 text-xs font-medium ${transparent ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200' : 'border-emerald-200/60 bg-emerald-50 text-emerald-700'}`}>
                        {formatSalary(job.salary_min, job.salary_max)}
                    </Badge>
                    {job.category && (
                        <Badge className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${transparent ? 'bg-violet-300/10 text-violet-200' : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'}`}>
                            {job.category.name}
                        </Badge>
                    )}
                </div>
                <CardDescription className="mt-2">
                    <p className="mt-1 mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        Descripción
                    </p>
                    <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-200">
                        {job.description}
                    </p>
                </CardDescription>
            </CardHeader>
            <CardFooter
                className={
                    transparent
                        ? 'gap-2 border-white/10 bg-transparent'
                        : 'gap-2 bg-slate-50/70 dark:bg-slate-800/10'
                }
            >
                {footer}
            </CardFooter>
        </Card>
    );
}
