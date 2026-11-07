<?php

namespace App\Http\Controllers;

use App\Models\ForumTopic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ForumTopicManageController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('estado', 'en_revision');

        $topics = ForumTopic::query()
            ->when($status !== 'todos', fn ($query) => $query->where('status', $status))
            ->with('author:id,name,email')
            ->withCount('replies')
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return inertia('administrar-comunidades/index', [
            'temas' => $topics,
            'etiquetas' => ForumTopic::TAGS,
            'estadoActivo' => $status,
        ]);
    }

    public function moderate(Request $request, ForumTopic $topic): RedirectResponse
    {
        Gate::authorize('moderate', $topic);

        $data = $request->validate([
            'status' => ['sometimes', 'required', Rule::in(['en_revision', 'publicado', 'rechazado'])],
            'admin_note' => ['nullable', 'required_if:status,rechazado', 'string', 'max:1000'],
            'is_pinned' => ['sometimes', 'boolean'],
            'is_closed' => ['sometimes', 'boolean'],
        ]);

        if (isset($data['status'])) {
            $topic->status = $data['status'];
            $topic->admin_note = $data['status'] === 'publicado' ? null : ($data['admin_note'] ?? null);
        }

        foreach (['is_pinned', 'is_closed'] as $flag) {
            if (array_key_exists($flag, $data)) {
                $topic->{$flag} = $data[$flag];
            }
        }

        $topic->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tema actualizado correctamente.']);

        return back();
    }
}
