<?php

namespace Database\Factories;

use App\Models\AdditionalInformation;
use App\Models\Region;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AdditionalInformation>
 */
class AdditionalInformationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'headline' => fake()->sentence(6),
            'profession' => fake()->jobTitle(),
            'institution' => fake()->company(),
            'region_id' => Region::query()->inRandomOrder()->value('id') ?? Region::forceCreate(['name' => fake()->state()])->id,
            'city' => fake()->city(),
            'postgrad_level' => fake()->randomElement(array_keys(AdditionalInformation::POSTGRAD_LEVELS)),
            'orcid' => null,
            'cv_path' => 'cvs/example.pdf',
            'open_to_work' => true,
            'is_public' => true,
        ];
    }

    public function incomplete(): static
    {
        return $this->state(['cv_path' => null, 'headline' => null]);
    }
}
