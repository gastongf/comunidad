<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('superadmin dashboard receives user statistics and regular users do not', function () {
    Role::findOrCreate('SuperAdmin');
    $superAdmin = User::factory()->create()->assignRole('SuperAdmin');
    User::factory()->count(2)->create();

    $this->actingAs($superAdmin)->get(route('dashboard'))->assertOk()->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('stats.totals.users', 3)
        ->has('stats.usersByRole', 1)
        ->has('stats.registrationsByMonth', 6));

    $this->actingAs(User::factory()->create())->get(route('dashboard'))->assertOk()->assertInertia(fn ($page) => $page
        ->where('stats', null));
});
