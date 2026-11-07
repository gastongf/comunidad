<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JobPostingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $jobs = [
            [
                'title' => 'Ingeniero de Datos AWS Junior',
                'description' => 'Buscamos un profesional interesado en desarrollar soluciones de ingeniería de datos en la nube, participando en procesos ETL, almacenamiento y análisis de información.',
                'requeriments' => "SQL y Python básico.\nConocimientos de bases de datos relacionales.\nInterés en AWS S3, Glue y Lambda.\nManejo de Git.\nDeseable experiencia en proyectos de datos.",
                'employment_type' => 'completa',
                'category_id' => 1,
                'work_mode' => 'hibrido',
                'salary_min' => '900000',
                'salary_max' => '1200000',
                'status' => 'pendiente',
                'start_date' => $now,
                'finish_date' => $now->copy()->addDays(30),
                'responsibilities' => "Desarrollo y mantenimiento de pipelines de datos.\nImplementación de soluciones en AWS.\nColaboración con equipos de análisis y desarrollo.\nOptimización de procesos ETL.\nDocumentación de procedimientos y buenas prácticas.",
                'rejection_reason' => '',
            ],
            [
                'title' => 'Desarrollador Full Stack Junior',
                'description' => 'Buscamos un desarrollador para participar en la construcción y mantenimiento de aplicaciones web, trabajando tanto en el frontend como en el backend.',
                'requeriments' => "Conocimientos de JavaScript y React.\nManejo de Node.js y APIs REST.\nConocimientos de SQL.\nUso de Git y GitHub.\nDeseable experiencia con Laravel o Express.js.",
                'responsibilities' => "Desarrollo de aplicaciones web frontend y backend.\nImplementación de APIs REST.\nColaboración con el equipo de diseño y producto.\nMantenimiento y optimización de código.\nDocumentación de procesos y buenas prácticas.",
                'employment_type' => 'completa',
                'category_id' => 2,
                'work_mode' => 'remoto',
                'salary_min' => '800000',
                'salary_max' => '1100000',
                'status' => 'pendiente',
                'start_date' => $now->copy()->addDays(2),
                'finish_date' => $now->copy()->addDays(32),
                'rejection_reason' => '',
            ],
            [
                'title' => 'Práctica Profesional en Química y Farmacia',
                'description' => 'Se busca estudiante para apoyar actividades de control de calidad, revisión documental y análisis de procesos en un entorno profesional relacionado con el área farmacéutica.',
                'requeriments' => "Estudiante de Química y Farmacia.\nConocimientos básicos de control de calidad.\nResponsabilidad y organización.\nCapacidad de trabajo en equipo.\nDisponibilidad para realizar práctica profesional.",
                'employment_type' => 'practica',
                'responsibilities' => "Apoyo en actividades de control de calidad.\nRevisión documental.\nAnálisis de procesos.\nColaboración con el equipo farmacéutico.\nCumplimiento de normativas y procedimientos.",
                'category_id' => 3,
                'work_mode' => 'presencial',
                'salary_min' => '200000',
                'salary_max' => '350000',
                'status' => 'pendiente',
                'start_date' => $now->copy()->addDays(5),
                'finish_date' => $now->copy()->addDays(35),
                'rejection_reason' => '',
            ],
            [
                'title' => 'Ingeniero de Datos AWS Junior',
                'description' => 'Buscamos un profesional interesado en desarrollar soluciones de ingeniería de datos en la nube, participando en procesos ETL, almacenamiento y análisis de información.',
                'requeriments' => "SQL y Python básico.\nConocimientos de bases de datos relacionales.\nInterés en AWS S3, Glue y Lambda.\nManejo de Git.\nDeseable experiencia en proyectos de datos.",
                'employment_type' => 'completa',
                'responsibilities' => "Desarrollo y mantenimiento de pipelines de datos.\nImplementación de soluciones en AWS.\nColaboración con equipos de análisis y desarrollo.\nOptimización de procesos ETL.\nDocumentación de procedimientos y buenas prácticas.",
                'category_id' => 5,
                'work_mode' => 'hibrido',
                'salary_min' => '1000000',
                'salary_max' => '1200000',
                'status' => 'pendiente',
                'start_date' => $now,
                'finish_date' => $now->copy()->addDays(30),
                'rejection_reason' => '',
            ],
        ];

        foreach ($jobs as $index => $job) {
            DB::table('job_postings')->updateOrInsert(
                ['slug' => Str::slug($job['title']).'-'.($index + 1)],
                array_merge($job, [
                    'company_id' => 1,
                    'posted_id' => 2,
                    'region_id' => 1,
                    'commune_id' => 1,
                    'approved_by' => 2,
                    'updated_at' => $now,
                    'created_at' => $now,
                ])
            );
        }
    }
}
