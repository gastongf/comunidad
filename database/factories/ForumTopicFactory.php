<?php

namespace Database\Factories;

use App\Models\ForumTopic;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ForumTopic>
 */
class ForumTopicFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(6),
            'tag' => fake()->randomElement(array_keys(ForumTopic::TAGS)),
            'content' => fake()->paragraphs(2, true),
            'status' => 'en_revision',
        ];
    }

    public function published(): static
    {
        return $this->state(['status' => 'publicado']);
    }
}
