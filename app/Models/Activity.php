<?php

namespace App\Models;

use Database\Factories\ActivityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activity extends Model
{
    /** @use HasFactory<ActivityFactory> */
    use HasFactory;

    /** @var array<string, string> */
    public const CATEGORIES = [
        'cursos_gratuitos' => 'Cursos gratuitos',
        'becas' => 'Becas',
        'congresos' => 'Congresos',
        'eventos_recreativos' => 'Eventos recreativos',
        'otras' => 'Otras actividades',
    ];

    protected $fillable = [
        'title',
        'category',
        'modality',
        'institution',
        'event_date',
        'is_free',
        'member_discount',
        'contact_or_link',
        'image_path',
        'description',
    ];

    protected $attributes = [
        'status' => 'en_revision',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'event_date' => 'date:Y-m-d',
            'is_free' => 'boolean',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
