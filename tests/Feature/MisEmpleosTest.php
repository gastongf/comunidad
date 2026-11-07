<?php

use App\Models\Company;
use App\Models\User;
use Database\Seeders\CareerCategoriesSeeder;
use Database\Seeders\RegionComunaSeeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

function createCompanyUser(string $name): array
{
    $user = User::factory()->create(['career_id' => null]);
    $user->assignRole('Empresa');
    $companyId = DB::table('companies')->insertGetId([
        'name' => $name,
        'owner_id' => $user->id,
        'region_id' => 1,
        'rut' => fake()->unique()->numerify('########-#'),
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return [$user, Company::find($companyId)];
}

function createJob(Company $company, string $status = 'publicado'): int
{
    return DB::table('job_postings')->insertGetId([
        'company_id' => $company->id,
        'posted_id' => $company->owner_id,
        'region_id' => 1,
        'category_id' => 1,
        'title' => 'Empleo '.fake()->unique()->word(),
        'slug' => fake()->unique()->slug(),
        'description' => 'Descripcion',
        'responsibilities' => 'Responsabilidades',
        'requeriments' => 'Requisitos',
        'employment_type' => 'completa',
        'work_mode' => 'remoto',
        'status' => $status,
        'start_date' => now(),
        'approved_by' => $company->owner_id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}

beforeEach(function () {
    $this->seed([CareerCategoriesSeeder::class, RegionComunaSeeder::class]);
    Permission::firstOrCreate(['name' => 'mis empleos', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'Empresa', 'guard_name' => 'web'])->givePermissionTo('mis empleos');
});

test('guests see published job cards paginated by 9 and are sent back to empleos after login', function () {
    [, $company] = createCompanyUser('Acme');
    foreach (range(1, 10) as $i) {
        createJob($company);
    }
    createJob($company, 'pendiente');

    $this->get(route('empleos.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->has('empleos.data', 9)
            ->where('empleos.total', 10));

    expect(session('url.intended'))->toBe(route('empleos.index'));
});

test('authenticated users see the internal empleos view', function () {
    [, $company] = createCompanyUser('Acme');
    createJob($company);

    $this->actingAs(User::factory()->create(['career_id' => null]))
        ->get(route('empleos.index'))
        ->assertInertia(fn ($page) => $page->component('empleos/index')->has('empleos.data', 1));
});

test('guests are redirected to login when opening a job detail', function () {
    [, $company] = createCompanyUser('Acme');

    $this->get(route('empleos.show', createJob($company)))->assertRedirect(route('login'));
});

test('authenticated users can open a published job detail but not an unpublished one', function () {
    [, $company] = createCompanyUser('Acme');
    $viewer = User::factory()->create(['career_id' => null]);

    $this->actingAs($viewer)->get(route('empleos.show', createJob($company)))->assertOk();
    $this->actingAs($viewer)->get(route('empleos.show', createJob($company, 'pendiente')))->assertForbidden();
});

test('a company only sees its own jobs in mis empleos paginated by 9', function () {
    [$user, $company] = createCompanyUser('Acme');
    [, $other] = createCompanyUser('Other');
    foreach (range(1, 10) as $i) {
        createJob($company, 'pendiente');
    }
    createJob($other);

    $this->actingAs($user)->get(route('mis-empleos.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('mis-empleos/index')
            ->has('empleos.data', 9)
            ->where('empleos.total', 10));
});

test('a company cannot open the detail of another company job through mis empleos', function () {
    [$user, $company] = createCompanyUser('Acme');
    [, $other] = createCompanyUser('Other');

    $this->actingAs($user)->get(route('mis-empleos.show', createJob($company, 'pendiente')))->assertOk();
    $this->actingAs($user)->get(route('mis-empleos.show', createJob($other)))->assertForbidden();
});

test('users without the mis empleos permission cannot access it', function () {
    $user = User::factory()->create(['career_id' => null]);

    $this->actingAs($user)->get(route('mis-empleos.index'))->assertNotFound();
});
