import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

type Option = { value: string | null; label: string };

export function FilterTabs({
    options,
    active,
    baseUrl,
    param,
}: {
    options: Option[];
    active: string | null | undefined;
    baseUrl: string;
    param: string;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => (
                <Button
                    key={option.label}
                    asChild
                    size="sm"
                    variant={(active ?? null) === option.value ? 'default' : 'outline'}
                >
                    <Link
                        href={option.value ? `${baseUrl}?${param}=${option.value}` : baseUrl}
                        preserveScroll
                    >
                        {option.label}
                    </Link>
                </Button>
            ))}
        </div>
    );
}
