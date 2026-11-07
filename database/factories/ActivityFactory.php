<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'category' => fake()->randomElement(array_keys(Activity::CATEGORIES)),
            'modality' => fake()->randomElement(['Online', 'Presencial', 'Híbrido']),
            'institution' => fake()->company(),
            'event_date' => fake()->dateTimeBetween('+1 week', '+6 months'),
            'is_free' => true,
            'description' => fake()->paragraph(),
            'status' => 'en_revision',
        ];
    }

    public function published(): static
    {
        return $this->state(['status' => 'publicado']);
    }

    public function congress(): static
    {
        return $this->state(['category' => 'congresos']);
    }
}
