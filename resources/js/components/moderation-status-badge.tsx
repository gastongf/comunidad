import { Badge } from '@/components/ui/badge';

const styles: Record<string, string> = {
    en_revision: 'bg-amber-50 border border-amber-200/60 text-amber-700',
    rechazado: 'bg-red-50 border border-red-200/60 text-red-700',
    publicado: 'bg-green-50 border border-green-200/60 text-green-700',
};

const labels: Record<string, string> = {
    en_revision: 'EN REVISIÓN',
    rechazado: 'RECHAZADO',
    publicado: 'PUBLICADO',
};

export function ModerationStatusBadge({ status }: { status: string }) {
    return (
        <Badge className={`px-2 py-0.5 text-[11px] font-semibold ${styles[status] ?? ''}`}>
            {labels[status] ?? status.toUpperCase()}
        </Badge>
    );
}
