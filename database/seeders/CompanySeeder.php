<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $empresa = User::factory()->create([
      'name' => 'Empresa User',
      'email' => 'empresa@example.com',
      'career_id' => null
    ]);

    $empresa->assignRole('Empresa');

    DB::table('companies')->insert([
      'name' => 'FarmaLab',
      'owner_id' => $empresa->id,
      'region_id' => 1,
      'rut' => '12345678-9',
      'website' => 'https://www.farmalab.com',
      'logo_path' => null,
      'description' => 'FarmaLab es una empresa líder en investigación y desarrollo de productos farmacéuticos, comprometida con la innovación y la calidad en el cuidado de la salud.',
      'status' => 'active',
      'created_at' => now(),
      'updated_at' => now(),
    ]);
  }
}
