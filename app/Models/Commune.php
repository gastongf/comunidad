<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['region_id', 'name'])]
class Commune extends Model
{
  public function region(): BelongsTo
  {
    return $this->belongsTo(Region::class);
  }

  public function jobPostings()
  {
    return $this->hasMany(JobPosting::class);
  }
}
