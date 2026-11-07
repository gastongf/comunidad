<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CareerSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $saludFarmacéuticas = [
      'Química y Farmacia',
      'Medicina',
      'Enfermería',
      'Obstetricia y Puericultura',
      'Tecnología Médica',
      'Nutrición y Dietética',
      'Kinesiología',
      'Odontología',
      'Fonoaudiología',
      'Terapia Ocupacional',
      'Salud Pública',
      'Salud y Seguridad Ocupacional'
    ];

    foreach ($saludFarmacéuticas as $carrera) {
      DB::table('careers')->insert([
        'career_category_id' => 1,
        'name' => $carrera,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    $biologicasBiotecnologia = [
      'Biología',
      'Biotecnología',
      'Bioquímica',
      'Genética',
      'Microbiología',
      'Zoología',
      'Botánica',
      'Ecología',
      'Oceanografía',
      'Ciencias Ambientales',
      'Biología Marina',
      'Biología Molecular',
      'Ciencias Biomédicas'
    ];

    foreach ($biologicasBiotecnologia as $carrera) {
      DB::table('careers')->insert([
        'career_category_id' => 2,
        'name' => $carrera,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    $quimicas = [
      'Química',
      'Química Industrial',
      'Química Analítica',
      'Química Orgánica',
      'Química Ambiental',
      'Química Inorgánica',
      'Ingeniería Química',
      'Ingeniería en Bioprocesos'
    ];

    foreach ($quimicas as $carrera) {
      DB::table('careers')->insert([
        'career_category_id' => 3,
        'name' => $carrera,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    $fisicasMatematicas = [
      'Física',
      'Matemáticas',
      'Astronomía',
      'Geofísica',
      'Astrofísica',
      'Estadística',
      'Ciencias de Datos'
    ];

    foreach ($fisicasMatematicas as $carrera) {
      DB::table('careers')->insert([
        'career_category_id' => 4,
        'name' => $carrera,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    $ambientalesTierra = [
      'Geología',
      'Geografía',
      'Ciencias Ambientales',
      'Ingeniería Ambiental',
      'Ingeniería en Recursos Naturales',
      'Oceanografía',
      'Meteorología',
      'Ingeniería Forestal',
      'Hidrología',
      'Ciencias de la Tierra'
    ];

    foreach ($ambientalesTierra as $carrera) {
      DB::table('careers')->insert([
        'career_category_id' => 5,
        'name' => $carrera,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    $ingenieriaTecnologia = [
      'Ingeniería Civil Informática',
      'Ingeniería en Computación',
      'Ingeniería Mecánica',
      'Ingeniería Eléctrica',
      'Ingeniería Electrónica',
      'Ingeniería en Telecomunicaciones',
      'Ingeniería en Inteligencia Artificial',
      'Ingeniería Industrial',
      'Ingeniería en Sistemas de Información',
      'Ingeniería en Energías Renovables',
      'Ingeniería en Robótica',
      'Ingeniería en Automatización'
    ];

    foreach ($ingenieriaTecnologia as $carrera) {
      DB::table('careers')->insert([
        'career_category_id' => 6,
        'name' => $carrera,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    $agrariasAlimentarias = [
      'Agronomía',
      'Medicina Veterinaria',
      'Ingeniería Agrícola',
      'Ingeniería en Alimentos',
      'Ingeniería Forestal',
      'Ingeniería en Recursos Naturales',
      'Ciencias de la Alimentación',
      'Ciencias Agropecuarias',
      'Ingeniería en Pesca',
      'Viticultura y Enología'
    ];

    foreach ($agrariasAlimentarias as $carrera) {
      DB::table('careers')->insert([
        'career_category_id' => 7,
        'name' => $carrera,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    $socialesHumanidades = [
      'Psicología',
      'Sociología',
      'Antropología',
      'Ciencias Políticas',
      'Historia',
      'Filosofía',
      'Educación',
      'Trabajo Social',
      'Lingüística',
      'Arqueología',
      'Geografía Humana',
      'Economía'
    ];

    foreach ($socialesHumanidades as $carrera) {
      DB::table('careers')->insert([
        'career_category_id' => 8,
        'name' => $carrera,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }
  }
}
