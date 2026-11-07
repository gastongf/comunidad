<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CareerCategory extends Model
{
    public function careers()
    {
        return $this->hasMany(Career::class);
    }

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }
}
