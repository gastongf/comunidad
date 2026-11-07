<?php

use Illuminate\Support\Facades\DB;
use Laravel\Fortify\Features;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());

    Role::create(['name' => 'Cientifico', 'guard_name' => 'web']);

    DB::table('career_categories')->insert([
        'name' => 'Categoría de prueba',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('careers')->insert([
        'career_category_id' => 1,
        'name' => 'Carrera de prueba',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'career_id' => 1,
        'password' => 'password',
        'password_confirmation' => 'password',
        'terms' => 'on',
        'privacy' => 'on',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $this->assertNotNull(auth()->user()->accepted_terms_at);
    $this->assertNotNull(auth()->user()->accepted_privacy_at);
});

test('registration requires terms and privacy acceptance', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'career_id' => 1,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['terms', 'privacy']);
    $this->assertGuest();
});
