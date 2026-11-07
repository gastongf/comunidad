import { router } from '@inertiajs/react';
import type { MouseEvent } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

export type PaginatorLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    links: PaginatorLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export function JobPagination({ links }: { links: PaginatorLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    const visit = (url: string | null) => (event: MouseEvent) => {
        event.preventDefault();

        if (url) {
            router.visit(url, { preserveScroll: true });
        }
    };

    return (
        <Pagination>
            <PaginationContent>
                {links.map((link, index) => {
                    const href = link.url ?? '#';

                    if (index === 0) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationPrevious
                                    href={href}
                                    text="Anterior"
                                    onClick={visit(link.url)}
                                    aria-disabled={!link.url}
                                    className={!link.url ? 'pointer-events-none opacity-50' : undefined}
                                />
                            </PaginationItem>
                        );
                    }

                    if (index === links.length - 1) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationNext
                                    href={href}
                                    text="Siguiente"
                                    onClick={visit(link.url)}
                                    aria-disabled={!link.url}
                                    className={!link.url ? 'pointer-events-none opacity-50' : undefined}
                                />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href={href}
                                isActive={link.active}
                                onClick={visit(link.url)}
                            >
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}
