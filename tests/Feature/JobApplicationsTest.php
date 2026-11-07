<?php

use App\Models\AdditionalInformation;
use App\Models\Company;
use App\Models\JobApplication;
use App\Models\User;
use Database\Seeders\CareerCategoriesSeeder;
use Database\Seeders\RegionComunaSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed([CareerCategoriesSeeder::class, RegionComunaSeeder::class]);
    Permission::firstOrCreate(['name' => 'mis empleos', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'Empresa', 'guard_name' => 'web'])->givePermissionTo('mis empleos');
    Role::firstOrCreate(['name' => 'Cientifico', 'guard_name' => 'web']);
});

function applicationsCompany(): array
{
    $owner = User::factory()->create(['career_id' => null])->assignRole('Empresa');
    $companyId = DB::table('companies')->insertGetId([
        'name' => 'Acme', 'owner_id' => $owner->id, 'region_id' => 1,
        'rut' => fake()->unique()->numerify('########-#'), 'status' => 'active',
        'created_at' => now(), 'updated_at' => now(),
    ]);
    $jobId = DB::table('job_postings')->insertGetId([
        'company_id' => $companyId, 'posted_id' => $owner->id, 'region_id' => 1, 'category_id' => 1,
        'title' => 'Empleo de prueba', 'slug' => fake()->unique()->slug(), 'description' => 'd',
        'responsibilities' => 'r', 'requeriments' => 'q', 'employment_type' => 'completa',
        'work_mode' => 'remoto', 'status' => 'publicado', 'start_date' => now(),
        'approved_by' => $owner->id, 'created_at' => now(), 'updated_at' => now(),
    ]);

    return [$owner, Company::find($companyId), $jobId];
}

function scientist(bool $complete): User
{
    $user = User::factory()->create(['career_id' => null])->assignRole('Cientifico');
    AdditionalInformation::factory()->for($user)->when(! $complete, fn ($factory) => $factory->incomplete())->create();

    return $user;
}

test('scientist with incomplete profile sees the dashboard alert and cannot apply', function () {
    [, , $jobId] = applicationsCompany();
    $user = scientist(false);

    $this->actingAs($user)->get(route('dashboard'))->assertInertia(fn ($page) => $page->where('profileIncomplete', true));

    $this->actingAs($user)->post(route('empleos.postular', $jobId))->assertForbidden();
    expect(JobApplication::count())->toBe(0);
});

test('scientist with a complete profile can apply once and the alert disappears', function () {
    [, , $jobId] = applicationsCompany();
    $user = scientist(true);

    $this->actingAs($user)->get(route('dashboard'))->assertInertia(fn ($page) => $page->where('profileIncomplete', false));

    $this->actingAs($user)->post(route('empleos.postular', $jobId), ['message' => 'Hola'])->assertRedirect();
    $this->actingAs($user)->post(route('empleos.postular', $jobId))->assertRedirect();

    expect(JobApplication::where('user_id', $user->id)->count())->toBe(1);
});

test('only scientists can apply', function () {
    [$owner, , $jobId] = applicationsCompany();

    $this->actingAs($owner)->post(route('empleos.postular', $jobId))->assertForbidden();
});

test('saving the professional profile requires the mandatory fields and a pdf cv', function () {
    Storage::fake('local');
    $user = User::factory()->create(['career_id' => null])->assignRole('Cientifico');

    $this->actingAs($user)->post(route('perfil-profesional.update'), [
        'open_to_work' => 1, 'is_public' => 1,
    ])->assertSessionHasErrors(['headline', 'profession', 'institution', 'region_id', 'city', 'cv']);

    $this->actingAs($user)->post(route('perfil-profesional.update'), [
        'headline' => 'Bioquímica', 'profession' => 'Bioquímica', 'institution' => 'U. de Chile',
        'region_id' => 1, 'city' => 'Santiago', 'postgrad_level' => 'ninguno',
        'cv' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf'),
        'open_to_work' => 1, 'is_public' => 1,
    ])->assertSessionHasNoErrors();

    expect($user->fresh()->hasCompleteProfessionalProfile())->toBeTrue();
});

test('company sees its applicants and the stats, other companies cannot', function () {
    [$owner, , $jobId] = applicationsCompany();
    [$otherOwner] = applicationsCompany();
    $applicant = scientist(true);
    JobApplication::factory()->create(['job_posting_id' => $jobId, 'user_id' => $applicant->id]);

    $this->actingAs($owner)->get(route('dashboard'))->assertInertia(fn ($page) => $page
        ->where('companyStats.totalApplicants', 1)
        ->where('companyStats.newApplications', 1));

    $this->actingAs($owner)->get(route('mis-empleos.postulantes', $jobId))->assertOk()->assertInertia(fn ($page) => $page
        ->component('mis-empleos/postulantes')
        ->has('postulaciones', 1));

    $this->actingAs($otherOwner)->get(route('mis-empleos.postulantes', $jobId))->assertForbidden();
});

test('only the owner company can change an application status or download the cv', function () {
    Storage::fake('local');
    Storage::disk('local')->put('cvs/test.pdf', 'pdf');
    [$owner, , $jobId] = applicationsCompany();
    [$otherOwner] = applicationsCompany();
    $applicant = scientist(true);
    $applicant->additionalInformation->update(['cv_path' => 'cvs/test.pdf']);
    $application = JobApplication::factory()->create(['job_posting_id' => $jobId, 'user_id' => $applicant->id]);

    $this->actingAs($otherOwner)->patch(route('postulaciones.update', $application), ['status' => 'revisada'])->assertForbidden();
    $this->actingAs($otherOwner)->get(route('cv.download', $applicant->additionalInformation))->assertForbidden();

    $this->actingAs($owner)->patch(route('postulaciones.update', $application), ['status' => 'revisada'])->assertRedirect();
    expect($application->fresh()->status)->toBe('revisada');
    $this->actingAs($owner)->get(route('cv.download', $applicant->additionalInformation))->assertOk();
});
