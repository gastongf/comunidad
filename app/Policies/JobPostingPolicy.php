<?php

namespace App\Policies;

use App\Models\JobPosting;
use App\Models\User;

class JobPostingPolicy
{
    /**
     * Determine whether the user can list the job postings of their own company.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('mis empleos') && $user->company()->exists();
    }

    /**
     * Only users with the create permission and a company can create job postings.
     */
    public function create(User $user): bool
    {
        return $user->can('crear empleos') && $user->company()->exists();
    }

    /**
     * Determine whether the user can view the job posting detail.
     */
    public function view(User $user, JobPosting $jobPosting): bool
    {
        return $jobPosting->status === 'publicado' || $this->manage($user, $jobPosting);
    }

    /**
     * Only scientists with a complete professional profile can apply to published jobs.
     */
    public function apply(User $user, JobPosting $jobPosting): bool
    {
        return $user->hasRole('Cientifico')
            && $jobPosting->status === 'publicado'
            && $user->hasCompleteProfessionalProfile();
    }

    /**
     * Determine whether the user can manage a job posting (only its owner company).
     */
    public function manage(User $user, JobPosting $jobPosting): bool
    {
        return $user->can('mis empleos')
            && $user->company()->whereKey($jobPosting->company_id)->exists();
    }
}
