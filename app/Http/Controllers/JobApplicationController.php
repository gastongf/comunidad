<?php

namespace App\Http\Controllers;

use App\Models\AdditionalInformation;
use App\Models\JobApplication;
use App\Models\JobPosting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class JobApplicationController extends Controller
{
    /**
     * A scientist applies to a published job, only with a complete professional profile.
     */
    public function store(Request $request, JobPosting $jobPosting): RedirectResponse
    {
        Gate::authorize('apply', $jobPosting);

        $data = $request->validate([
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        JobApplication::firstOrCreate(
            ['job_posting_id' => $jobPosting->id, 'user_id' => $request->user()->id],
            ['message' => $data['message'] ?? null],
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tu postulación fue enviada.']);

        return back();
    }

    /**
     * Applicants of a job posting owned by the authenticated company.
     */
    public function index(JobPosting $jobPosting): Response
    {
        Gate::authorize('manage', $jobPosting);

        $applications = $jobPosting->applications()
            ->with(['user:id,name,email', 'user.additionalInformation.region:id,name'])
            ->latest()
            ->get()
            ->map(fn (JobApplication $application) => [
                'id' => $application->id,
                'status' => $application->status,
                'message' => $application->message,
                'created_at' => $application->created_at,
                'user' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                ],
                'profile' => $application->user->additionalInformation ? [
                    'id' => $application->user->additionalInformation->id,
                    'headline' => $application->user->additionalInformation->headline,
                    'profession' => $application->user->additionalInformation->profession,
                    'institution' => $application->user->additionalInformation->institution,
                    'region' => $application->user->additionalInformation->region?->name,
                    'city' => $application->user->additionalInformation->city,
                    'postgrad_level' => $application->user->additionalInformation->postgrad_level,
                    'orcid' => $application->user->additionalInformation->orcid,
                    'has_cv' => filled($application->user->additionalInformation->cv_path),
                ] : null,
            ]);

        return inertia('mis-empleos/postulantes', [
            'empleo' => $jobPosting->only(['id', 'title']),
            'postulaciones' => $applications,
            'estados' => JobApplication::STATUSES,
            'nivelesPostgrado' => AdditionalInformation::POSTGRAD_LEVELS,
        ]);
    }

    public function update(Request $request, JobApplication $jobApplication): RedirectResponse
    {
        Gate::authorize('manage', $jobApplication->jobPosting);

        $data = $request->validate([
            'status' => ['required', Rule::in(array_keys(JobApplication::STATUSES))],
        ]);

        $jobApplication->update($data);

        return back();
    }
}
