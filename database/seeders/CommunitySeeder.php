<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\ForumReply;
use App\Models\ForumTopic;
use App\Models\Paper;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommunitySeeder extends Seeder
{
    /**
     * Seed example congresses, activities, forum topics and papers.
     */
    public function run(): void
    {
        $author = User::where('email', 'cientifico@example.com')->firstOrFail();
        $admin = User::where('email', 'test@example.com')->firstOrFail();

        $activities = [
            ['Congreso Chileno de Bioprocesos', 'congresos', 'Presencial', 'Universidad de Chile', 'publicado'],
            ['Congreso de Geociencias del Norte', 'congresos', 'Híbrido', 'Universidad de Antofagasta', 'publicado'],
            ['Congreso Nacional de Química Verde', 'congresos', 'Online', 'Sociedad Chilena de Química', 'en_revision'],
            ['Curso gratuito de Bioinformática', 'cursos_gratuitos', 'Online', 'Comunidad Científica', 'publicado'],
            ['Beca ANID Magíster Nacional', 'becas', 'Online', 'ANID', 'publicado'],
            ['Trekking geológico Valle del Elqui', 'eventos_recreativos', 'Presencial', 'Club de Geología', 'publicado'],
        ];

        foreach ($activities as [$title, $category, $modality, $institution, $status]) {
            Activity::factory()->for($author, 'author')->create([
                'title' => $title,
                'category' => $category,
                'modality' => $modality,
                'institution' => $institution,
                'status' => $status,
            ]);
        }

        $topic = ForumTopic::factory()->published()->for($author, 'author')->create([
            'title' => '¿Qué herramientas usan para análisis de datos genómicos?',
            'tag' => 'biotecnologia',
            'is_pinned' => true,
        ]);

        ForumReply::factory()->for($topic, 'topic')->for($admin, 'author')->create([
            'content' => 'Nosotros trabajamos con Bioconductor y Nextflow; los resultados han sido muy buenos.',
        ]);

        ForumTopic::factory()->for($author, 'author')->create([
            'title' => 'Busco colaboradores para un proyecto de geoquímica',
            'tag' => 'colaboracion',
        ]);

        Paper::factory()->for($author)->create(['title' => 'Lithium brine extraction in the Atacama Salar']);
        Paper::factory()->request()->for($author)->create(['title' => 'CRISPR-based diagnostics for plant pathogens']);

        foreach ([
            'Machine learning for mineral exploration',
            'Extremophile microbiomes in high-altitude lagoons',
            'Green hydrogen electrolysis catalysts',
            'Glacier mass balance in the Andes',
            'Marine biotechnology of Chilean macroalgae',
        ] as $title) {
            Paper::factory()->request()->for($author)->create(['title' => $title]);
        }
    }
}
