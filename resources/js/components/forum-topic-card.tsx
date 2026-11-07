import { MessageSquare, Pin } from 'lucide-react';
import type { ReactNode } from 'react';
import { ModerationStatusBadge } from '@/components/moderation-status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export type ForumTopicSummary = {
    id: number;
    title: string;
    tag: string;
    content: string;
    status: string;
    admin_note: string | null;
    is_pinned: boolean;
    is_closed: boolean;
    views: number;
    created_at: string;
    replies_count?: number;
    author?: { id: number; name: string; email?: string } | null;
};

export function ForumTopicCard({
    topic,
    tags,
    showStatus = false,
    footer,
}: {
    topic: ForumTopicSummary;
    tags: Record<string, string>;
    showStatus?: boolean;
    footer?: ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                    {showStatus && <ModerationStatusBadge status={topic.status} />}
                    {topic.is_pinned && (
                        <Badge className="inline-flex items-center gap-1 bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                            <Pin /> Fijado
                        </Badge>
                    )}
                    {topic.is_closed && (
                        <Badge className="bg-secondary px-2 py-1 text-xs text-secondary-foreground">Cerrado</Badge>
                    )}
                    <Badge className="bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        {tags[topic.tag] ?? topic.tag}
                    </Badge>
                </div>
                <CardTitle className="text-lg font-bold">{topic.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                    {topic.author?.name} · {new Date(topic.created_at).toLocaleDateString('es-CL')}
                </p>
                <CardDescription className="line-clamp-2">{topic.content}</CardDescription>
                {showStatus && topic.admin_note && (
                    <p className="text-xs text-red-700">Observación: {topic.admin_note}</p>
                )}
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="size-3" /> {topic.replies_count ?? 0} respuestas · {topic.views} vistas
                </p>
            </CardHeader>
            {footer && <CardFooter className="gap-2">{footer}</CardFooter>}
        </Card>
    );
}
