<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    /**
     * Listing of published activities (courses, scholarships, congresses, etc.).
     */
    public function index(Request $request): Response
    {
        $category = $request->query('categoria');

        if ($request->user() === null) {
            $request->session()->put('url.intended', $request->fullUrl());

            return inertia('publico/vista-previa', [
                'seccion' => 'actividades',
                'items' => Activity::query()
                    ->where('status', 'publicado')
                    ->when($category && array_key_exists($category, Activity::CATEGORIES), fn ($query) => $query->where('category', $category))
                    ->latest()
                    ->limit(6)
                    ->get()
                    ->map(fn (Activity $activity) => $this->summary($activity)),
                'categorias' => Activity::CATEGORIES,
                'categoriaActiva' => $category,
            ]);
        }

        $activities = Activity::query()
            ->where('status', 'publicado')
            ->when($category && array_key_exists($category, Activity::CATEGORIES), fn ($query) => $query->where('category', $category))
            ->with('author:id,name')
            ->latest()
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Activity $activity) => $this->summary($activity));

        return inertia('actividades/index', [
            'actividades' => $activities,
            'categorias' => Activity::CATEGORIES,
            'categoriaActiva' => $category,
        ]);
    }

    public function show(Request $request, Activity $activity): Response
    {
        Gate::authorize('view', $activity);

        if ($request->user() === null) {
            $request->session()->put('url.intended', $request->fullUrl());
        }

        return inertia($request->user() === null ? 'publico/actividad' : 'actividades/ver', [
            'actividad' => $this->summary($activity->load('author:id,name')),
            'categorias' => Activity::CATEGORIES,
        ]);
    }

    /**
     * Activities submitted by the authenticated user, whatever their moderation status.
     */
    public function mine(Request $request): Response
    {
        $activities = Activity::query()
            ->whereBelongsTo($request->user(), 'author')
            ->latest()
            ->paginate(9)
            ->through(fn (Activity $activity) => $this->summary($activity));

        return inertia('actividades/mis-actividades', [
            'actividades' => $activities,
            'categorias' => Activity::CATEGORIES,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Activity::class);

        return inertia('actividades/crear', [
            'categorias' => Activity::CATEGORIES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', Activity::class);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'category' => ['required', Rule::in(array_keys(Activity::CATEGORIES))],
            'modality' => ['required', Rule::in(['Online', 'Presencial', 'Híbrido'])],
            'institution' => ['nullable', 'string', 'max:150'],
            'event_date' => ['nullable', 'date'],
            'is_free' => ['required', 'boolean'],
            'member_discount' => ['nullable', 'string', 'max:150'],
            'contact_or_link' => ['nullable', 'string', 'max:255'],
            'poster' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:4096'],
            'description' => ['required', 'string', 'max:5000'],
        ]);

        $poster = $request->file('poster');
        unset($data['poster']);

        $activity = new Activity($data);
        $activity->user_id = $request->user()->id;
        $activity->status = 'en_revision';

        if ($poster) {
            $activity->image_path = $poster->store('afiches', 'public');
        }

        $activity->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Actividad enviada. Será publicada cuando la administración la apruebe.']);

        return redirect()->route('actividades.mias');
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Activity $activity): array
    {
        return [
            ...$activity->only([
                'id', 'title', 'category', 'modality', 'institution', 'event_date',
                'is_free', 'member_discount', 'contact_or_link', 'description', 'status', 'admin_note',
            ]),
            'image_url' => $activity->image_path ? Storage::disk('public')->url($activity->image_path) : null,
            'author' => $activity->relationLoaded('author') ? $activity->author?->only(['id', 'name']) : null,
        ];
    }
}
