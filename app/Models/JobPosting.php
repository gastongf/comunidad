<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['start_date' => 'datetime', 'finish_date' => 'datetime'];
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function comuna()
    {
        return $this->belongsTo(Commune::class);
    }

    public function category()
    {
        return $this->belongsTo(CareerCategory::class);
    }
}
