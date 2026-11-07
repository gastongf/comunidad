import type { ReactNode } from 'react';
import type { ActivitySummary } from '@/components/activity-card';
import { ModerationStatusBadge } from '@/components/moderation-status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function ActivityDetail({
    activity,
    categories,
    footer,
}: {
    activity: ActivitySummary;
    categories: Record<string, string>;
    footer?: ReactNode;
}) {
    const details: [string, string | null | undefined][] = [
        ['Institución', activity.institution],
        ['Fecha', activity.event_date ? new Date(`${activity.event_date}T00:00:00`).toLocaleDateString('es-CL') : null],
        ['Descuento para inscritos', activity.member_discount],
        ['Publicado por', activity.author?.name],
    ];

    return (
        <Card className="overflow-hidden">
            {activity.image_url && (
                <img src={activity.image_url} alt={activity.title} className="max-h-[28rem] w-full object-cover" />
            )}
            <CardHeader>
                {activity.status !== 'publicado' && <ModerationStatusBadge status={activity.status} />}
                <CardTitle className="text-2xl font-bold">{activity.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{categories[activity.category] ?? activity.category}</Badge>
                    <Badge variant="secondary">{activity.modality}</Badge>
                    <Badge variant="secondary">{activity.is_free ? 'Gratuito' : 'De pago'}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed whitespace-pre-line">{activity.description}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    {details
                        .filter(([, value]) => value)
                        .map(([label, value]) => (
                            <div key={label}>
                                <h2 className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    {label}
                                </h2>
                                <p className="text-sm">{value}</p>
                            </div>
                        ))}
                </div>
            </CardContent>
            {footer && <CardFooter className="flex-wrap gap-2">{footer}</CardFooter>}
        </Card>
    );
}
