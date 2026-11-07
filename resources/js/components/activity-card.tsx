import { CalendarDays, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { ModerationStatusBadge } from '@/components/moderation-status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export type ActivitySummary = {
    id: number;
    title: string;
    category: string;
    modality: string;
    institution: string | null;
    event_date: string | null;
    is_free: boolean;
    member_discount?: string | null;
    contact_or_link?: string | null;
    description: string;
    status: string;
    admin_note: string | null;
    image_url?: string | null;
    author?: { id: number; name: string; email?: string } | null;
};

export function ActivityCard({
    activity,
    categories,
    showStatus = false,
    footer,
}: {
    activity: ActivitySummary;
    categories: Record<string, string>;
    showStatus?: boolean;
    footer?: ReactNode;
}) {
    return (
        <Card className="flex flex-col overflow-hidden">
            {activity.image_url && (
                <img src={activity.image_url} alt={activity.title} className="h-40 w-full object-cover" />
            )}
            <CardHeader className="flex-1">
                {showStatus && <ModerationStatusBadge status={activity.status} />}
                <CardTitle className="text-lg font-bold">{activity.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        {categories[activity.category] ?? activity.category}
                    </Badge>
                    <Badge className="inline-flex items-center gap-1 bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                        <MapPin />
                        {activity.modality}
                    </Badge>
                    {activity.event_date && (
                        <Badge className="inline-flex items-center gap-1 bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                            <CalendarDays />
                            {new Date(`${activity.event_date}T00:00:00`).toLocaleDateString('es-CL')}
                        </Badge>
                    )}
                    <Badge className="border border-emerald-200/60 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        {activity.is_free ? 'Gratuito' : 'De pago'}
                    </Badge>
                </div>
                {activity.institution && (
                    <p className="text-xs font-medium text-muted-foreground">{activity.institution}</p>
                )}
                <CardDescription className="line-clamp-3 mt-1">{activity.description}</CardDescription>
                {showStatus && activity.admin_note && (
                    <p className="text-xs text-red-700">Observación: {activity.admin_note}</p>
                )}
            </CardHeader>
            {footer && <CardFooter className="gap-2">{footer}</CardFooter>}
        </Card>
    );
}
