<?php

use App\Models\Activity;
use App\Models\ForumTopic;
use App\Models\Paper;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

function moderatorUser(): User
{
    $role = Role::findOrCreate('Administrador', 'web');
    foreach (['moderar actividades', 'moderar comunidades', 'ver mensajes de contacto'] as $permission) {
        $role->givePermissionTo(Permission::findOrCreate($permission, 'web'));
    }

    $user = User::factory()->create(['career_id' => null]);
    $user->assignRole($role);

    return $user;
}

function regularUser(): User
{
    return User::factory()->create(['career_id' => null]);
}

test('guests are redirected to login from restricted community pages', function (string $url) {
    $this->get($url)->assertRedirect(route('login'));
})->with(['/contacto', '/actividades/crear', '/comunidades/crear']);

test('guests see a limited public preview of papers, activities and topics', function () {
    Paper::factory()->count(8)->create(['type' => Paper::TYPE_REQUEST]);
    Activity::factory()->published()->count(8)->create();
    ForumTopic::factory()->published()->count(8)->create();

    foreach (['/papers' => 'papers', '/actividades' => 'actividades', '/comunidades' => 'comunidades'] as $url => $section) {
        $this->get($url)->assertOk()->assertInertia(fn ($page) => $page
            ->component('publico/vista-previa')
            ->where('seccion', $section)
            ->has('items', 6));
    }
});

test('activities listing only shows published ones and filters by category', function () {
    Activity::factory()->published()->congress()->create(['title' => 'Congreso visible']);
    Activity::factory()->published()->create(['title' => 'Beca visible', 'category' => 'becas']);
    Activity::factory()->congress()->create(['title' => 'Congreso oculto']);

    $this->actingAs(regularUser())
        ->get('/actividades?categoria=congresos')
        ->assertInertia(fn ($page) => $page
            ->component('actividades/index')
            ->has('actividades.data', 1)
            ->where('actividades.data.0.title', 'Congreso visible'));
});

test('a user can propose an activity which starts in review', function () {
    $user = regularUser();

    $this->actingAs($user)->post('/actividades', [
        'title' => 'Congreso de prueba',
        'category' => 'congresos',
        'modality' => 'Online',
        'is_free' => '1',
        'description' => 'Descripción del congreso',
    ])->assertRedirect(route('actividades.mias'));

    $this->assertDatabaseHas('activities', [
        'title' => 'Congreso de prueba',
        'user_id' => $user->id,
        'status' => 'en_revision',
    ]);
});

test('an unpublished activity is only visible to its author and moderators', function () {
    $activity = Activity::factory()->create();

    $this->actingAs(regularUser())->get("/actividades/{$activity->id}")->assertForbidden();
    $this->actingAs($activity->author)->get("/actividades/{$activity->id}")->assertOk();
    $this->actingAs(moderatorUser())->get("/actividades/{$activity->id}")->assertOk();
});

test('only moderators can approve and reject activities', function () {
    $activity = Activity::factory()->create();

    $this->actingAs(regularUser())->get('/administrar-actividades')->assertNotFound();
    $this->actingAs(regularUser())
        ->patch("/administrar-actividades/{$activity->id}", ['status' => 'publicado'])
        ->assertNotFound();

    $moderator = moderatorUser();
    $this->actingAs($moderator)
        ->patch("/administrar-actividades/{$activity->id}", ['status' => 'publicado'])
        ->assertRedirect();
    expect($activity->refresh()->status)->toBe('publicado');

    $this->actingAs($moderator)
        ->patch("/administrar-actividades/{$activity->id}", ['status' => 'rechazado'])
        ->assertSessionHasErrors('admin_note');

    $this->actingAs($moderator)
        ->patch("/administrar-actividades/{$activity->id}", ['status' => 'rechazado', 'admin_note' => 'Falta información'])
        ->assertRedirect();
    expect($activity->refresh())->status->toBe('rechazado')->admin_note->toBe('Falta información');
});

test('users can create forum topics that need moderation before replies are allowed', function () {
    $user = regularUser();

    $this->actingAs($user)->post('/comunidades', [
        'title' => 'Tema de prueba',
        'tag' => 'debate',
        'content' => 'Contenido suficientemente largo',
    ])->assertRedirect(route('comunidades.mis-temas'));

    $topic = ForumTopic::firstOrFail();
    expect($topic->status)->toBe('en_revision');

    $this->actingAs(regularUser())
        ->post("/comunidades/{$topic->id}/respuestas", ['content' => 'Hola'])
        ->assertForbidden();
});

test('published forum topics accept replies and count views', function () {
    $topic = ForumTopic::factory()->published()->create();

    $this->actingAs(regularUser())
        ->post("/comunidades/{$topic->id}/respuestas", ['content' => 'Buena pregunta'])
        ->assertRedirect();

    $this->actingAs(regularUser())->get("/comunidades/{$topic->id}")->assertOk();

    expect($topic->replies()->count())->toBe(1);
    expect($topic->refresh()->views)->toBe(1);
});

test('closed forum topics reject replies', function () {
    $topic = ForumTopic::factory()->published()->create(['is_closed' => true]);

    $this->actingAs(regularUser())
        ->post("/comunidades/{$topic->id}/respuestas", ['content' => 'Hola'])
        ->assertForbidden();
});

test('only moderators can moderate forum topics', function () {
    $topic = ForumTopic::factory()->create();

    $this->actingAs(regularUser())
        ->patch("/administrar-comunidades/{$topic->id}", ['status' => 'publicado'])
        ->assertNotFound();

    $this->actingAs(moderatorUser())
        ->patch("/administrar-comunidades/{$topic->id}", ['status' => 'publicado', 'is_pinned' => true])
        ->assertRedirect();

    expect($topic->refresh())->status->toBe('publicado')->is_pinned->toBeTrue();
});

test('papers can be requested and then contributed', function () {
    $user = regularUser();

    $this->actingAs($user)->post('/papers', [
        'type' => 'solicitud',
        'title' => 'Paper buscado',
        'scientific_area' => 'Química',
    ])->assertRedirect();

    $this->actingAs($user)->post('/papers', [
        'type' => 'aporte',
        'title' => 'Paper sin enlace',
        'scientific_area' => 'Química',
    ])->assertSessionHasErrors('doi_or_link');

    $paper = Paper::firstOrFail();
    $contributor = regularUser();

    $this->actingAs($contributor)
        ->patch("/papers/{$paper->id}/aportar", ['doi_or_link' => 'https://doi.org/10.1000/1'])
        ->assertRedirect();

    expect($paper->refresh())
        ->type->toBe(Paper::TYPE_CONTRIBUTION)
        ->contributed_by->toBe($contributor->name);
});

test('contact messages are stored and only visible to authorized users', function () {
    $this->actingAs(regularUser())->post('/contacto', [
        'name' => 'Ana',
        'email' => 'ana@example.com',
        'subject' => 'Consulta',
        'message' => 'Quisiera más información',
    ])->assertRedirect(route('contacto.create'));

    $this->assertDatabaseHas('contact_messages', ['email' => 'ana@example.com']);

    $this->actingAs(regularUser())->get('/mensajes-contacto')->assertNotFound();
    $this->actingAs(moderatorUser())->get('/mensajes-contacto')->assertOk();
});

test('guests can open a published activity detail but not an unpublished one', function () {
    $published = Activity::factory()->published()->create();
    $pending = Activity::factory()->create();

    $this->get(route('actividades.show', $published))->assertOk()->assertInertia(fn ($page) => $page
        ->component('publico/actividad')
        ->where('actividad.id', $published->id));

    $this->get(route('actividades.show', $pending))->assertForbidden();
});
