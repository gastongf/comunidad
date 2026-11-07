<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\User;

class ActivityPolicy
{
    public function view(?User $user, Activity $activity): bool
    {
        return $activity->status === 'publicado'
            || ($user !== null && ($user->id === $activity->user_id || $user->can('moderar actividades')));
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function moderate(User $user, Activity $activity): bool
    {
        return $user->can('moderar actividades');
    }
}
