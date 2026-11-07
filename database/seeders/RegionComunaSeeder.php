<?php

namespace Database\Seeders;

use App\Models\Region;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class RegionComunaSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $data = json_decode(
      File::get(base_path('data/comunas-regiones.json')),
      true,
      512,
      JSON_THROW_ON_ERROR
    );

    DB::transaction(function () use ($data) {
      foreach ($data['regiones'] as $item) {
        $region = Region::firstOrCreate(['name' => $item['region']]);

        $now = now();
        $comunas = array_map(fn($nombre) => [
          'region_id'  => $region->id,
          'name'     => $nombre,
          'created_at' => $now,
          'updated_at' => $now,
        ], $item['comunas']);

        DB::table('communes')->upsert($comunas, ['region_id', 'name'], ['updated_at']);
      }
    });
  }
}
