<?php

namespace App\Http\Controllers;

use App\Models\CareerCategory;
use App\Models\Commune;
use App\Models\JobPosting;
use App\Models\Region;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MyJobPostingController extends Controller
{
    /**
     * Listing of the job postings that belong to the authenticated company.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', JobPosting::class);

        $jobPostings = $request->user()->company
            ->jobPostings()
            ->with('category:id,name')
            ->withCount('applications')
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return inertia('mis-empleos/index', [
            'empleos' => $jobPostings,
        ]);
    }

    /**
     * Detail of a job posting owned by the authenticated company.
     */
    public function show(JobPosting $jobPosting): Response
    {
        Gate::authorize('manage', $jobPosting);

        return inertia('empleos/ver', [
            'empleo' => $jobPosting->load(['category:id,name', 'company:id,name', 'region:id,name']),
            'backUrl' => route('mis-empleos.index'),
            'postulantesUrl' => route('mis-empleos.postulantes', $jobPosting),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', JobPosting::class);

        return Inertia::render('mis-empleos/crear', $this->formOptions());
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', JobPosting::class);

        $data = $this->validated($request);

        $request->user()->company->jobPostings()->create($data + [
            'posted_id' => $request->user()->id,
            'slug' => Str::slug($data['title']).'-'.Str::lower(Str::random(6)),
            'status' => 'pendiente',
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Empleo creado. Quedó pendiente de aprobación.']);

        return to_route('mis-empleos.index');
    }

    public function edit(JobPosting $jobPosting): Response
    {
        Gate::authorize('manage', $jobPosting);

        return Inertia::render('mis-empleos/editar', $this->formOptions() + [
            'empleo' => $jobPosting->only([
                'id', 'title', 'description', 'responsibilities', 'requeriments', 'employment_type',
                'work_mode', 'salary_min', 'salary_max', 'category_id', 'region_id', 'commune_id',
                'start_date', 'finish_date', 'status', 'rejection_reason',
            ]),
        ]);
    }

    public function update(Request $request, JobPosting $jobPosting): RedirectResponse
    {
        Gate::authorize('manage', $jobPosting);

        $jobPosting->update($this->validated($request) + [
            'status' => 'pendiente',
            'rejection_reason' => null,
            'approved_by' => null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Empleo actualizado. Quedó pendiente de aprobación.']);

        return to_route('mis-empleos.index');
    }

    public function close(JobPosting $jobPosting): RedirectResponse
    {
        Gate::authorize('manage', $jobPosting);

        $jobPosting->update(['status' => 'cerrado']);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Empleo cerrado.']);

        return to_route('mis-empleos.index');
    }

    public function destroy(JobPosting $jobPosting): RedirectResponse
    {
        Gate::authorize('manage', $jobPosting);

        $jobPosting->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Empleo eliminado.']);

        return to_route('mis-empleos.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'categories' => CareerCategory::orderBy('name')->get(['id', 'name']),
            'regions' => Region::orderBy('name')->get(['id', 'name']),
            'communes' => Commune::orderBy('name')->get(['id', 'region_id', 'name']),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'responsibilities' => 'required|string|max:5000',
            'requeriments' => 'required|string|max:5000',
            'employment_type' => ['required', Rule::in(['completa', 'parcial', 'plazo_fijo', 'indefinido', 'honorarios', 'practica'])],
            'work_mode' => ['required', Rule::in(['presencial', 'remoto', 'hibrido'])],
            'salary_min' => 'nullable|string|max:50',
            'salary_max' => 'nullable|string|max:50',
            'category_id' => 'required|exists:career_categories,id',
            'region_id' => 'required|exists:regions,id',
            'commune_id' => ['nullable', Rule::exists('communes', 'id')->where('region_id', $request->input('region_id'))],
            'start_date' => 'required|date',
            'finish_date' => 'nullable|date|after_or_equal:start_date',
        ]);
    }
}
