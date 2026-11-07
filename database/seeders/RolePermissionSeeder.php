<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // * Creacion de usuario

        $admin = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'career_id' => null,
        ]);

        // *Creacion de roles y permisos
        $roles = [
            'SuperAdmin',
            'Administrador',
            'Empresa',
            'Cientifico',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate([
                'name' => $role,
                'guard_name' => 'web',
            ]);
        }

        // * Asignar el rol de "Administrador" al usuario creado
        $admin->assignRole('Administrador');

        $permisosAdministrador = [
            'ver usuarios',
            'crear usuarios',
            'editar usuarios',
            'eliminar usuarios',
            'crear empresas',
            'editar empresas',
            'eliminar empresas',
            'ver empresas',
            'ver empleos',
            'crear empleos',
            'editar empleos',
            'eliminar empleos',
            'administrar empleos',
            'moderar actividades',
            'moderar comunidades',
            'ver mensajes de contacto',
        ];

        foreach ($permisosAdministrador as $permiso) {
            Permission::firstOrCreate([
                'name' => $permiso,
                'guard_name' => 'web',
            ]);
        }

        // Obtener el rol Administrador
        $rolAdministrador = Role::findByName('Administrador', 'web');

        // Asignar permisos al rol
        $rolAdministrador->syncPermissions($permisosAdministrador);

        // Asignar rol al usuario
        $admin->assignRole($rolAdministrador);

        $permisosEmpresa = [
            'ver empleos',
            'crear empleos',
            'editar empleos',
            'eliminar empleos',
            'mis empleos',
        ];

        foreach ($permisosEmpresa as $permiso) {
            Permission::firstOrCreate([
                'name' => $permiso,
                'guard_name' => 'web',
            ]);
        }

        // Obtener el rol Empresa
        $rolEmpresa = Role::findByName('Empresa', 'web');

        // Asignar permisos al rol Empresa
        $rolEmpresa->syncPermissions($permisosEmpresa);

        // Asignar permiso de ver empleos al rol Cientifico
        Role::findByName('Cientifico', 'web')->syncPermissions(['ver empleos']);

        // * SuperAdmin: recibe todos los permisos existentes
        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'career_id' => null,
        ]);

        $rolSuperAdmin = Role::findByName('SuperAdmin', 'web');
        $rolSuperAdmin->syncPermissions(Permission::all());
        $superAdmin->assignRole($rolSuperAdmin);

    }
}
