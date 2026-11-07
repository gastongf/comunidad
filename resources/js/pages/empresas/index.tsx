import { Head, Link, router } from '@inertiajs/react';
import { Pencil, RotateCcw, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Empresa = {
    id: number;
    name: string;
    rut: string;
    status: 'active' | 'inactive';
    deleted_at: string | null;
    job_postings_count: number;
    owner: { name: string; email: string } | null;
    region: { name: string } | null;
};

type Paginated = {
    data: Empresa[];
    links: { url: string | null; label: string; active: boolean }[];
};

export default function IndexEmpresas({
    empresas,
    filters,
}: {
    empresas: Paginated;
    filters: { estado: 'activas' | 'eliminadas'; buscar: string };
}) {
    const buscar = (value: string) =>
        router.get('/empresas', { estado: filters.estado, buscar: value }, { preserveState: true, replace: true });

    return (
        <>
            <Head title="Empresas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold">Listado de Empresas</h1>
                        <p className="text-sm text-muted-foreground">Administra las empresas registradas.</p>
                    </div>
                    <Button asChild>
                        <Link href="/empresas/crear">Nueva Empresa</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button asChild size="sm" variant={filters.estado === 'activas' ? 'default' : 'outline'}>
                        <Link href="/empresas">Activas</Link>
                    </Button>
                    <Button asChild size="sm" variant={filters.estado === 'eliminadas' ? 'default' : 'outline'}>
                        <Link href="/empresas?estado=eliminadas">Eliminadas</Link>
                    </Button>
                    <Input
                        className="max-w-xs"
                        placeholder="Buscar por nombre o RUT"
                        defaultValue={filters.buscar}
                        onKeyDown={(e) => e.key === 'Enter' && buscar(e.currentTarget.value)}
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>RUT</TableHead>
                            <TableHead>Región</TableHead>
                            <TableHead>Propietario</TableHead>
                            <TableHead>Empleos</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {empresas.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    No hay empresas.
                                </TableCell>
                            </TableRow>
                        )}
                        {empresas.data.map((empresa) => (
                            <TableRow key={empresa.id}>
                                <TableCell className="font-medium">{empresa.name}</TableCell>
                                <TableCell>{empresa.rut}</TableCell>
                                <TableCell>{empresa.region?.name ?? '-'}</TableCell>
                                <TableCell>{empresa.owner?.email ?? '-'}</TableCell>
                                <TableCell>{empresa.job_postings_count}</TableCell>
                                <TableCell>
                                    <Badge variant={empresa.status === 'active' ? 'default' : 'secondary'}>
                                        {empresa.status === 'active' ? 'Activa' : 'Inactiva'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="space-x-2 text-right">
                                    {empresa.deleted_at ? (
                                        <Button size="sm" variant="outline" onClick={() => router.patch(`/empresas/${empresa.id}/restaurar`)}>
                                            <RotateCcw /> Restaurar
                                        </Button>
                                    ) : (
                                        <>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/empresas/${empresa.id}/editar`}>
                                                    <Pencil /> Editar
                                                </Link>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive">
                                                        <Trash2 /> Eliminar
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Eliminar {empresa.name}?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            La empresa se moverá a "Eliminadas" y podrás restaurarla.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => router.delete(`/empresas/${empresa.id}`)}>
                                                            Eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex flex-wrap gap-1">
                    {empresas.links.map((link, i) =>
                        link.url ? (
                            <Button key={i} asChild size="sm" variant={link.active ? 'default' : 'outline'}>
                                <Link href={link.url} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Button>
                        ) : null,
                    )}
                </div>
            </div>
        </>
    );
}

IndexEmpresas.layout = {
    breadcrumbs: [{ title: 'Empresas', href: '/empresas' }],
};
