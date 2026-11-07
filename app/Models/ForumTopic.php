<?php

namespace App\Models;

use Database\Factories\ForumTopicFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumTopic extends Model
{
    /** @use HasFactory<ForumTopicFactory> */
    use HasFactory;

    /** @var array<string, string> */
    public const TAGS = [
        'biotecnologia' => 'Biotecnología',
        'geologia' => 'Geología',
        'quimica' => 'Química',
        'academia' => 'Academia',
        'colaboracion' => 'Colaboración',
        'debate' => 'Debate',
    ];

    protected $fillable = [
        'title',
        'tag',
        'content',
    ];

    protected $attributes = [
        'status' => 'en_revision',
        'is_pinned' => false,
        'is_closed' => false,
        'views' => 0,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_pinned' => 'boolean',
            'is_closed' => 'boolean',
            'views' => 'integer',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ForumReply::class);
    }
}
