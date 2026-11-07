<?php

namespace App\Models;

use Database\Factories\AdditionalInformationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdditionalInformation extends Model
{
    /** @use HasFactory<AdditionalInformationFactory> */
    use HasFactory;

    protected $table = 'additional_information';

    public const POSTGRAD_LEVELS = [
        'magister' => 'Magíster',
        'doctorado' => 'Doctorado',
        'postdoc' => 'Postdoctorado',
    ];

    /** Fields the scientist must fill in before applying to jobs. */
    public const REQUIRED_FIELDS = ['headline', 'profession', 'institution', 'region_id', 'city', 'cv_path'];

    protected $fillable = [
        'user_id', 'headline', 'profession', 'institution', 'region_id', 'city',
        'postgrad_level', 'orcid', 'cv_path', 'open_to_work', 'is_public',
    ];

    protected function casts(): array
    {
        return [
            'open_to_work' => 'boolean',
            'is_public' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function isComplete(): bool
    {
        foreach (self::REQUIRED_FIELDS as $field) {
            if (blank($this->{$field})) {
                return false;
            }
        }

        return true;
    }
}
