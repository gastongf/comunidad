<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class JobPostingController extends Controller
{
    /**
     * Public listing of published job postings (cards only).
     */
    public function index(Request $request): Response
    {
        if ($request->user() === null) {
            // Tras iniciar sesión o registrarse, el usuario vuelve a /empleos.
            $request->session()->put('url.intended', $request->fullUrl());
        }

        $jobPostings = JobPosting::query()
            ->where('status', 'publicado')
            ->with(['category:id,name', 'company:id,name'])
            ->latest()
            ->paginate(9)
            ->withQueryString()
            ->through(fn (JobPosting $jobPosting) => $jobPosting->only([
                'id', 'title', 'description', 'employment_type', 'work_mode',
                'salary_min', 'salary_max', 'status', 'category', 'company',
            ]));

        return inertia($request->user() ? 'empleos/index' : 'welcome', [
            'empleos' => $jobPostings,
        ]);
    }

    /**
     * Full job posting detail (authenticated users only).
     */
    public function show(Request $request, JobPosting $jobPosting): Response
    {
        Gate::authorize('view', $jobPosting);

        $user = $request->user();
        $isScientist = $user->hasRole('Cientifico');

        return inertia('empleos/ver', [
            'empleo' => $jobPosting->load(['category:id,name', 'company:id,name', 'region:id,name']),
            'backUrl' => route('empleos.index'),
            'postulacion' => $isScientist && $jobPosting->status === 'publicado' ? [
                'hasApplied' => $jobPosting->applications()->where('user_id', $user->id)->exists(),
                'profileComplete' => $user->hasCompleteProfessionalProfile(),
            ] : null,
        ]);
    }
}
