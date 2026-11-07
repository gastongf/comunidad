import { Head, Link, router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Application = {
    id: number;
    status: string;
    message: string | null;
    created_at: string;
    user: { id: number; name: string; email: string };
    profile: {
        id: number;
        headline: string | null;
        profession: string | null;
        institution: string | null;
        region: string | null;
        city: string | null;
        postgrad_level: string | null;
        orcid: string | null;
        has_cv: boolean;
    } | null;
};

type Props = {
    empleo: { id: number; title: string };
    postulaciones: Application[];
    estados: Record<string, string>;
    nivelesPostgrado: Record<string, string>;
};

export default function Postulantes({ empleo, postulaciones, estados, nivelesPostgrado }: Props) {
    return (
        <>
            <Head title={`Postulantes - ${empleo.title}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold">Postulantes</h1>
                        <p className="text-sm text-muted-foreground">
                            {empleo.title} · {postulaciones.length} postulación(es)
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={`/mis-empleos/${empleo.id}`}>Volver al empleo</Link>
                    </Button>
                </div>

                {postulaciones.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">Aún no hay postulantes para este empleo.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {postulaciones.map((application) => (
                            <Card key={application.id}>
                                <CardHeader>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <CardTitle className="text-base font-bold">{application.user.name}</CardTitle>
                                        <Select
                                            defaultValue={application.status}
                                            onValueChange={(status) =>
                                                router.patch(`/postulaciones/${application.id}`, { status }, { preserveScroll: true })
                                            }
                                        >
                                            <SelectTrigger className="w-44">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(estados).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <CardDescription>{application.profile?.headline ?? application.user.email}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3 text-sm">
                                    {application.profile && (
                                        <div className="flex flex-wrap gap-2">
                                            {application.profile.profession && <Badge variant="secondary">{application.profile.profession}</Badge>}
                                            {application.profile.institution && <Badge variant="secondary">{application.profile.institution}</Badge>}
                                            {application.profile.postgrad_level && (
                                                <Badge variant="secondary">
                                                    {nivelesPostgrado[application.profile.postgrad_level] ?? application.profile.postgrad_level}
                                                </Badge>
                                            )}
                                            {application.profile.region && (
                                                <Badge variant="secondary">
                                                    {application.profile.region}
                                                    {application.profile.city && ` · ${application.profile.city}`}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        {application.user.email}
                                        {application.profile?.orcid && ` · ORCID ${application.profile.orcid}`}
                                        {` · Postuló el ${new Date(application.created_at).toLocaleDateString('es-CL')}`}
                                    </p>
                                    {application.message && <p className="whitespace-pre-line">{application.message}</p>}
                                    {application.profile?.has_cv && (
                                        <Button asChild variant="outline" size="sm" className="w-fit">
                                            <a href={`/cv/${application.profile.id}`}>
                                                <Download /> Descargar CV
                                            </a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Postulantes.layout = {
    breadcrumbs: [
        { title: 'Mis empleos', href: '/mis-empleos' },
        { title: 'Postulantes', href: '#' },
    ],
};
