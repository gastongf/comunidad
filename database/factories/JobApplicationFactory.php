<?php

namespace Database\Factories;

use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobApplication>
 */
class JobApplicationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'job_posting_id' => JobPosting::query()->value('id'),
            'user_id' => User::factory(),
            'message' => fake()->sentence(),
            'status' => 'recibida',
        ];
    }
}
