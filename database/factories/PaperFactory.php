<?php

namespace Database\Factories;

use App\Models\Paper;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Paper>
 */
class PaperFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => Paper::TYPE_CONTRIBUTION,
            'title' => fake()->sentence(8),
            'authors_or_journal' => fake()->name(),
            'scientific_area' => fake()->randomElement(['Biotecnología', 'Geología', 'Química']),
            'doi_or_link' => 'https://doi.org/10.1000/'.fake()->numerify('#####'),
        ];
    }

    public function request(): static
    {
        return $this->state(fn () => [
            'type' => Paper::TYPE_REQUEST,
            'doi_or_link' => null,
            'requester_email' => fake()->safeEmail(),
        ]);
    }
}
