<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CareerCategoriesSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $categorias = [
      'Ciencias de la Salud y Farmacéuticas',
      'Ciencias Biológicas y Biotecnología',
      'Ciencias Químicas',
      'Ciencias Físicas y Matemáticas',
      'Ciencias Ambientales y de la Tierra',
      'Ingeniería y Tecnología',
      'Ciencias Agrarias y Alimentarias',
      'Ciencias Sociales y Humanidades'
    ];

    foreach ($categorias as $categoria) {
      DB::table('career_categories')->insert([
        'name' => $categoria,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }
  }
}
