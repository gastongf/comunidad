<?php

use App\Models\Company;
use App\Models\User;
use Database\Seeders\RegionComunaSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
    $this->seed(RegionComunaSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('Administrador');
});

function makeCompany(array $overrides = []): Company
{
    $owner = User::factory()->create();

    return Company::create(array_merge([
        'owner_id' => $owner->id,
        'region_id' => 1,
        'name' => 'Acme',
        'rut' => '11111111-1',
        'status' => 'active',
    ], $overrides));
}

test('admin creates a company with owner role, region and logo', function () {
    Storage::fake('public');

    $this->actingAs($this->admin)->post('/empresas', [
        'name_user' => 'Dueño',
        'email' => 'dueno@example.com',
        'password' => 'password123',
        'name_company' => 'Nueva SA',
        'region_id' => 1,
        'rut' => '22222222-2',
        'logo' => UploadedFile::fake()->image('logo.png'),
    ])->assertRedirect('/empresas');

    $company = Company::where('rut', '22222222-2')->firstOrFail();
    expect($company->region_id)->toBe(1)
        ->and($company->owner->hasRole('Empresa'))->toBeTrue();
    Storage::disk('public')->assertExists($company->logo_path);
});

test('admin updates a company', function () {
    $company = makeCompany();

    $this->actingAs($this->admin)->put("/empresas/{$company->id}", [
        'name_company' => 'Renombrada',
        'region_id' => 1,
        'rut' => '11111111-1',
        'status' => 'inactive',
    ])->assertRedirect('/empresas');

    expect($company->fresh())->name->toBe('Renombrada')->status->toBe('inactive');
});

test('admin soft deletes and restores a company', function () {
    $company = makeCompany();

    $this->actingAs($this->admin)->delete("/empresas/{$company->id}")->assertRedirect('/empresas');
    expect(Company::find($company->id))->toBeNull()
        ->and(Company::withTrashed()->find($company->id))->not->toBeNull();

    $this->actingAs($this->admin)->patch("/empresas/{$company->id}/restaurar")->assertRedirect('/empresas');
    expect(Company::find($company->id))->not->toBeNull();
});

test('index lists trashed companies only in the deleted filter', function () {
    $company = makeCompany();
    $company->delete();

    $this->actingAs($this->admin)->get('/empresas')->assertInertia(fn ($page) => $page->has('empresas.data', 0));
    $this->actingAs($this->admin)->get('/empresas?estado=eliminadas')->assertInertia(fn ($page) => $page->has('empresas.data', 1));
});

test('company owner edits own company without changing status', function () {
    $company = makeCompany();
    $company->owner->assignRole('Empresa');

    $this->actingAs($company->owner)->put('/mi-empresa', [
        'name_company' => 'Mi Nueva Razon',
        'region_id' => 1,
        'rut' => '11111111-1',
        'status' => 'inactive',
    ])->assertRedirect('/mi-empresa');

    expect($company->fresh())->name->toBe('Mi Nueva Razon')->status->toBe('active');
    $this->actingAs($company->owner)->get('/mi-empresa')->assertOk();
});

test('users without permission cannot delete companies', function () {
    $company = makeCompany();
    $user = User::factory()->create();
    $user->assignRole('Cientifico');

    $this->actingAs($user)->delete("/empresas/{$company->id}")->assertNotFound();
    expect(Company::find($company->id))->not->toBeNull();
});
