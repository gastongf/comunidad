<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class ScientistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $scientist = User::firstOrCreate(
            ['email' => 'cientifico@example.com'],
            User::factory()->make(['name' => 'Cientifico User', 'email' => 'cientifico@example.com', 'career_id' => null])->getAttributes(),
        );

        $scientist->assignRole('Cientifico');
    }
}
