<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name'])]
class Region extends Model
{
  public function comunas(): HasMany
  {
    return $this->hasMany(Commune::class);
  }

  public function companies(): HasMany
  {
    return $this->hasMany(Company::class);
  }
}
