<?php

use App\Models\Company;
use App\Models\JobPosting;
use App\Models\User;
use Database\Seeders\CareerCategoriesSeeder;
use Database\Seeders\RegionComunaSeeder;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed([RolePermissionSeeder::class, CareerCategoriesSeeder::class, RegionComunaSeeder::class]);
    $this->owner = User::factory()->create();
    $this->owner->assignRole('Empresa');
    $this->company = Company::create([
        'owner_id' => $this->owner->id, 'region_id' => 1, 'name' => 'Acme', 'rut' => '1-9', 'status' => 'active',
    ]);
});

function jobPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Investigador Senior',
        'description' => 'Descripcion',
        'responsibilities' => 'Responsabilidades',
        'requeriments' => 'Requisitos',
        'employment_type' => 'completa',
        'work_mode' => 'remoto',
        'category_id' => 1,
        'region_id' => 1,
        'start_date' => now()->toDateString(),
    ], $overrides);
}

test('company creates a job that starts pending', function () {
    $this->actingAs($this->owner)->get('/mis-empleos/crear')->assertOk();

    $this->actingAs($this->owner)->post('/mis-empleos', jobPayload())->assertRedirect('/mis-empleos');

    $job = JobPosting::firstOrFail();
    expect($job->company_id)->toBe($this->company->id)
        ->and($job->status)->toBe('pendiente')
        ->and($job->approved_by)->toBeNull();
});

test('job creation validates required fields', function () {
    $this->actingAs($this->owner)->post('/mis-empleos', [])->assertSessionHasErrors(['title', 'category_id', 'region_id']);
});

test('editing a job sends it back to review and delete removes it', function () {
    $this->actingAs($this->owner)->post('/mis-empleos', jobPayload());
    $job = JobPosting::firstOrFail();
    $job->update(['status' => 'rechazado', 'rejection_reason' => 'x']);

    $this->actingAs($this->owner)->put("/mis-empleos/{$job->id}", jobPayload(['title' => 'Nuevo titulo']))
        ->assertRedirect('/mis-empleos');
    expect($job->fresh())->title->toBe('Nuevo titulo')->status->toBe('pendiente')->rejection_reason->toBeNull();

    $this->actingAs($this->owner)->patch("/mis-empleos/{$job->id}/cerrar");
    expect($job->fresh()->status)->toBe('cerrado');

    $this->actingAs($this->owner)->delete("/mis-empleos/{$job->id}")->assertRedirect('/mis-empleos');
    expect(JobPosting::count())->toBe(0);
});

test('company cannot edit jobs of another company', function () {
    $this->actingAs($this->owner)->post('/mis-empleos', jobPayload());
    $job = JobPosting::firstOrFail();

    $other = User::factory()->create();
    $other->assignRole('Empresa');
    Company::create(['owner_id' => $other->id, 'region_id' => 1, 'name' => 'Otra', 'rut' => '2-7', 'status' => 'active']);

    $this->actingAs($other)->put("/mis-empleos/{$job->id}", jobPayload())->assertForbidden();
    $this->actingAs($other)->delete("/mis-empleos/{$job->id}")->assertForbidden();
});

test('administrator approving publishes the job', function () {
    $this->actingAs($this->owner)->post('/mis-empleos', jobPayload());
    $job = JobPosting::firstOrFail();

    $admin = User::factory()->create();
    $admin->assignRole('Administrador');

    $this->actingAs($admin)->post('/administrar-empleos/aprobar', ['id' => $job->id])->assertRedirect();
    expect($job->fresh())->status->toBe('publicado')->approved_by->toBe($admin->id);
});
