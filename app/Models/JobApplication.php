<?php

namespace App\Models;

use Database\Factories\JobApplicationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    /** @use HasFactory<JobApplicationFactory> */
    use HasFactory;

    public const STATUSES = [
        'recibida' => 'Recibida',
        'revisada' => 'Revisada',
        'preseleccionada' => 'Preseleccionada',
        'descartada' => 'Descartada',
    ];

    protected $fillable = ['job_posting_id', 'user_id', 'message', 'status'];

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
