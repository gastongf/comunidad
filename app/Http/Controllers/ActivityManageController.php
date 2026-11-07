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

class ActivityManageController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('estado', 'en_revision');

        $activities = Activity::query()
            ->when($status !== 'todos', fn ($query) => $query->where('status', $status))
            ->with('author:id,name,email')
            ->latest()
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Activity $activity) => [
                ...$activity->only([
                    'id', 'title', 'category', 'modality', 'institution', 'event_date',
                    'is_free', 'description', 'status', 'admin_note',
                ]),
                'author' => $activity->author?->only(['id', 'name', 'email']),
            ]);

        return inertia('administrar-actividades/index', [
            'actividades' => $activities,
            'categorias' => Activity::CATEGORIES,
            'estadoActivo' => $status,
        ]);
    }

    public function moderate(Request $request, Activity $activity): RedirectResponse
    {
        Gate::authorize('moderate', $activity);

        $data = $request->validate([
            'status' => ['required', Rule::in(['en_revision', 'publicado', 'rechazado'])],
            'admin_note' => ['nullable', 'required_if:status,rechazado', 'string', 'max:1000'],
        ]);

        $activity->status = $data['status'];
        $activity->admin_note = $data['status'] === 'publicado' ? null : ($data['admin_note'] ?? null);
        $activity->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Actividad actualizada correctamente.']);

        return back();
    }

    public function destroy(Activity $activity): RedirectResponse
    {
        Gate::authorize('moderate', $activity);

        if ($activity->image_path) {
            Storage::disk('public')->delete($activity->image_path);
        }

        $activity->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Actividad eliminada correctamente.']);

        return back();
    }
}
