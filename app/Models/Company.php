<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id');
    }
}
