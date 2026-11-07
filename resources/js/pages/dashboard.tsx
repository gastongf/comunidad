import { Head, Link } from '@inertiajs/react';
import { UserRoundPen } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { dashboard } from '@/routes';

type Row = { label: string; total: number };

type Stats = {
    totals: Record<'users' | 'verified' | 'newThisMonth' | 'jobs' | 'activities' | 'topics' | 'replies' | 'papers', number>;
    pending: Record<'activities' | 'topics' | 'jobs' | 'messages', number>;
    usersByRole: Row[];
    usersByArea: Row[];
    usersWithoutArea: number;
    registrationsByMonth: Row[];
    jobsByArea: Row[];
};

function StatCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
    return (
        <Card>
            <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-3xl font-bold">{value}</CardTitle>
                {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            </CardHeader>
        </Card>
    );
}

const chartColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

function toChartData(rows: Row[]) {
    return rows.map((row, index) => ({ ...row, fill: chartColors[index % chartColors.length] }));
}

const totalConfig = { total: { label: 'Total', color: 'var(--chart-1)' } } satisfies ChartConfig;

function HorizontalBarChart({ title, description, rows }: { title: string; description?: string; rows: Row[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                {rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin datos todavía.</p>
                ) : (
                    <ChartContainer config={totalConfig} className="w-full" style={{ height: Math.max(rows.length * 44, 120) }}>
                        <BarChart data={toChartData(rows)} layout="vertical" margin={{ left: 0, right: 16 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={130} />
                            <XAxis type="number" hide allowDecimals={false} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey="total" radius={4}>
                                <LabelList dataKey="total" position="right" className="fill-foreground" fontSize={12} />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}

function RolePieChart({ title, rows }: { title: string; rows: Row[] }) {
    const data = toChartData(rows);
    const config = Object.fromEntries(data.map((row) => [row.label, { label: row.label, color: row.fill }])) satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={config} className="mx-auto aspect-square max-h-64">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="label" hideLabel />} />
                        <Pie data={data} dataKey="total" nameKey="label" innerRadius={55} strokeWidth={2} />
                        <ChartLegend content={<ChartLegendContent nameKey="label" />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

function RegistrationsChart({ title, rows }: { title: string; rows: Row[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={totalConfig} className="h-56 w-full">
                    <AreaChart data={rows} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Area dataKey="total" type="monotone" fill="var(--color-total)" fillOpacity={0.25} stroke="var(--color-total)" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
type CompanyStats = {
    totalApplicants: number;
    totalApplications: number;
    newApplications: number;
    jobsCount: number;
    byJob: Row[];
    byStatus: Row[];
    byLevel: Row[];
    recent: { id: number; name: string; profession: string | null; job: string; job_id: number; created_at: string }[];
};

function ProfileAlert() {
    return (
        <Alert>
            <UserRoundPen />
            <AlertTitle>Completa tu perfil profesional</AlertTitle>
            <AlertDescription>
                Para poder postular a empleos necesitamos tu información profesional y tu CV.
                <Link href="/perfil-profesional" className="ml-1 font-medium underline">
                    Completar ahora
                </Link>
            </AlertDescription>
        </Alert>
    );
}

function CompanyDashboard({ stats }: { stats: CompanyStats }) {
    return (
        <>
            <div>
                <h1 className="text-xl font-semibold">Panel de empresa</h1>
                <p className="text-sm text-muted-foreground">Resumen de los postulantes a tus empleos.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Postulantes" value={stats.totalApplicants} />
                <StatCard label="Postulaciones" value={stats.totalApplications} />
                <StatCard label="Sin revisar" value={stats.newApplications} />
                <StatCard label="Empleos publicados" value={stats.jobsCount} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <HorizontalBarChart title="Postulantes por empleo" rows={stats.byJob} />
                <RolePieChart title="Estado de las postulaciones" rows={stats.byStatus.filter((row) => row.total > 0)} />
                <HorizontalBarChart title="Postulantes por nivel de postgrado" rows={stats.byLevel} />
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Postulantes recientes</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {stats.recent.length === 0 && <p className="text-sm text-muted-foreground">Aún no hay postulaciones.</p>}
                        {stats.recent.map((item) => (
                            <Link key={item.id} href={`/mis-empleos/${item.job_id}/postulantes`} className="flex flex-col text-sm hover:underline">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {item.profession ? `${item.profession} · ` : ''}
                                    {item.job}
                                </span>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default function Dashboard({
    stats,
    profileIncomplete = false,
    companyStats = null,
}: {
    stats: Stats | null;
    profileIncomplete?: boolean;
    companyStats?: CompanyStats | null;
}) {
    if (!stats) {
        return (
            <>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    {profileIncomplete && <ProfileAlert />}
                    {companyStats ? (
                        <CompanyDashboard stats={companyStats} />
                    ) : (
                        <div className="relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    )}
                </div>
            </>
        );
    }
    const { totals, pending } = stats;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Panel de SuperAdmin</h1>
                    <p className="text-sm text-muted-foreground">Resumen de usuarios y actividad de la plataforma.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard label="Usuarios totales" value={totals.users} hint={`${totals.newThisMonth} nuevos este mes`} />
                    <StatCard label="Correos verificados" value={totals.verified} />
                    <StatCard label="Empleos publicados" value={totals.jobs} />
                    <StatCard label="Cursos y congresos" value={totals.activities} />
                    <StatCard label="Temas de comunidad" value={totals.topics} />
                    <StatCard label="Respuestas en foro" value={totals.replies} />
                    <StatCard label="Papers" value={totals.papers} />
                    <StatCard label="Mensajes de contacto" value={pending.messages} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <HorizontalBarChart title="Usuarios por área de trabajo" description={`${stats.usersWithoutArea} usuarios sin área asignada`} rows={stats.usersByArea} />
                    <RolePieChart title="Usuarios por rol" rows={stats.usersByRole} />
                    <RegistrationsChart title="Registros por mes (últimos 6 meses)" rows={stats.registrationsByMonth} />
                    <HorizontalBarChart title="Empleos publicados por área" rows={stats.jobsByArea} />
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <StatCard label="Actividades por moderar" value={pending.activities} />
                    <StatCard label="Temas por moderar" value={pending.topics} />
                    <StatCard label="Empleos pendientes" value={pending.jobs} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
