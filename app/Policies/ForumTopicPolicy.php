<?php

namespace App\Policies;

use App\Models\ForumTopic;
use App\Models\User;

class ForumTopicPolicy
{
    public function view(?User $user, ForumTopic $topic): bool
    {
        return $topic->status === 'publicado'
            || ($user !== null && ($user->id === $topic->user_id || $user->can('moderar comunidades')));
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function reply(User $user, ForumTopic $topic): bool
    {
        return $topic->status === 'publicado' && ! $topic->is_closed;
    }

    public function moderate(User $user, ForumTopic $topic): bool
    {
        return $user->can('moderar comunidades');
    }
}
