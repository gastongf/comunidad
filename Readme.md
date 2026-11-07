# Pasos para correr proyecto

1.- Instalar dependencias

```bash
composer install
npm install
```

2.- Crear archivo .env y pegar el example

3.- Generar Key
```bash
php artisan key:generate
```

4.- Hacer Build
```bash
npm run build
```

5.- Correr las migraciones
```bash
php artisan migrate
```

6.- Correr los seeders
```bash
php artisan db:seed
```

7.- Levantar Server
```bash
composer run dev
```
> Para que se vean los afiches de las actividades/congresos ejecutar tambien `php artisan storage:link`.

## Usuarios de prueba (creados por los seeders)

Todos los usuarios usan la contraseña **`password`**.

| Rol | Correo | Contraseña | Accesos principales |
|-----|--------|------------|---------------------|
| SuperAdmin | superadmin@example.com | password | Todos los permisos: usuarios, empresas, empleos, moderación de actividades/congresos y comunidades, mensajes de contacto |
| Administrador | test@example.com | password | Usuarios, empresas, empleos, moderación de actividades/congresos y comunidades, mensajes de contacto |
| Empresa | empresa@example.com | password | Publicar y gestionar "Mis Empleos" |
| Cientifico | cientifico@example.com | password | Ver empleos, congresos y actividades, comunidades (foros), papers y contacto |

## Modulos

- **Empleos**: bolsa de empleo, administración y moderación de empleos.
- **Congresos y actividades** (`/actividades`): cursos gratuitos, becas, congresos, eventos y otras actividades. Cualquier usuario propone y la administración aprueba o rechaza (`/administrar-actividades`).
- **Comunidades** (`/comunidades`): foros por etiqueta con respuestas. Los temas pasan por moderación, que además puede fijarlos o cerrarlos (`/administrar-comunidades`).
- **Papers y recursos** (`/papers`): solicitud y aporte colaborativo de papers.
- **Contacto** (`/contacto`): formulario; los mensajes los ven SuperAdmin/Administrador en `/mensajes-contacto`.