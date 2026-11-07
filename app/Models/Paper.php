<?php

namespace App\Models;

use Database\Factories\PaperFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paper extends Model
{
    /** @use HasFactory<PaperFactory> */
    use HasFactory;

    public const TYPE_REQUEST = 'solicitud';

    public const TYPE_CONTRIBUTION = 'aporte';

    protected $fillable = [
        'type',
        'title',
        'authors_or_journal',
        'scientific_area',
        'doi_or_link',
        'requester_email',
        'comment',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
