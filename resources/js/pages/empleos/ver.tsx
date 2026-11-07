import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle2, UserRoundPen } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Empleo = {
    id: number;
    title: string;
    description: string;
    responsibilities: string;
    requeriments: string;
    employment_type: string;
    work_mode: string;
    status: string;
    category?: { name: string } | null;
    company?: { name: string } | null;
    region?: { name: string } | null;
};

const sections: { key: 'description' | 'responsibilities' | 'requeriments'; title: string }[] = [
    { key: 'description', title: 'Descripción' },
    { key: 'responsibilities', title: 'Responsabilidades' },
    { key: 'requeriments', title: 'Requisitos' },
];

type Postulacion = { hasApplied: boolean; profileComplete: boolean } | null;

export default function VerEmpleo({
    empleo,
    backUrl,
    postulacion = null,
    postulantesUrl = null,
}: {
    empleo: Empleo;
    backUrl: string;
    postulacion?: Postulacion;
    postulantesUrl?: string | null;
}) {
    const form = useForm({ message: '' });

    return (
        <>
            <Head title={empleo.title} />
            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <p className="text-xs font-medium text-muted-foreground">{empleo.company?.name}</p>
                        <CardTitle className="text-xl font-bold">{empleo.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{empleo.employment_type}</Badge>
                            <Badge variant="secondary">{empleo.work_mode}</Badge>
                            {empleo.category && <Badge variant="secondary">{empleo.category.name}</Badge>}
                            {empleo.region && <Badge variant="secondary">{empleo.region.name}</Badge>}
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {sections.map(({ key, title }) => (
                            <div key={key}>
                                <h2 className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    {title}
                                </h2>
                                <p className="text-sm leading-relaxed whitespace-pre-line">{empleo[key]}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                {postulacion && !postulacion.profileComplete && (
                    <Alert>
                        <UserRoundPen />
                        <AlertTitle>Completa tu perfil profesional para postular</AlertTitle>
                        <AlertDescription>
                            Necesitamos tus datos y tu CV antes de enviar una postulación.
                            <Link href="/perfil-profesional" className="ml-1 font-medium underline">
                                Completar ahora
                            </Link>
                        </AlertDescription>
                    </Alert>
                )}
                {postulacion?.hasApplied && (
                    <Alert>
                        <CheckCircle2 />
                        <AlertTitle>Ya postulaste a este empleo</AlertTitle>
                        <AlertDescription>La empresa revisará tu perfil y tu CV.</AlertDescription>
                    </Alert>
                )}
                {postulacion && postulacion.profileComplete && !postulacion.hasApplied && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Postular a este empleo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="flex flex-col gap-3"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    form.post(`/empleos/${empleo.id}/postular`, { preserveScroll: true });
                                }}
                            >
                                <Textarea
                                    value={form.data.message}
                                    onChange={(event) => form.setData('message', event.target.value)}
                                    placeholder="Mensaje para la empresa (opcional)"
                                />
                                <Button type="submit" className="w-fit" disabled={form.processing}>
                                    Postular
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
                <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline">
                        <Link href={backUrl}>Volver</Link>
                    </Button>
                    {postulantesUrl && (
                        <Button asChild>
                            <Link href={postulantesUrl}>Ver postulantes</Link>
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}
