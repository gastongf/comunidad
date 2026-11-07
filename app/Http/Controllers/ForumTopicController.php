<?php

namespace App\Http\Controllers;

use App\Models\ForumReply;
use App\Models\ForumTopic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ForumTopicController extends Controller
{
    public function index(Request $request): Response
    {
        $tag = $request->query('tag');
        $search = $request->query('q');

        if ($request->user() === null) {
            $request->session()->put('url.intended', $request->fullUrl());

            return inertia('publico/vista-previa', [
                'seccion' => 'comunidades',
                'items' => ForumTopic::query()
                    ->where('status', 'publicado')
                    ->with('author:id,name')
                    ->withCount('replies')
                    ->orderByDesc('is_pinned')
                    ->latest()
                    ->limit(6)
                    ->get(),
                'etiquetas' => ForumTopic::TAGS,
            ]);
        }

        $topics = ForumTopic::query()
            ->where('status', 'publicado')
            ->when($tag && array_key_exists($tag, ForumTopic::TAGS), fn ($query) => $query->where('tag', $tag))
            ->when($search, fn ($query, $text) => $query->where(function ($sub) use ($text) {
                $sub->where('title', 'like', "%{$text}%")->orWhere('content', 'like', "%{$text}%");
            }))
            ->with('author:id,name')
            ->withCount('replies')
            ->orderByDesc('is_pinned')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('comunidades/index', [
            'temas' => $topics,
            'etiquetas' => ForumTopic::TAGS,
            'filtros' => ['tag' => $tag, 'q' => $search],
        ]);
    }

    public function mine(Request $request): Response
    {
        $topics = ForumTopic::query()
            ->whereBelongsTo($request->user(), 'author')
            ->with('author:id,name')
            ->withCount('replies')
            ->latest()
            ->paginate(10);

        return inertia('comunidades/mis-temas', [
            'temas' => $topics,
            'etiquetas' => ForumTopic::TAGS,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', ForumTopic::class);

        return inertia('comunidades/crear', [
            'etiquetas' => ForumTopic::TAGS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', ForumTopic::class);

        $data = $request->validate([
            'title' => ['required', 'string', 'min:5', 'max:200'],
            'tag' => ['required', Rule::in(array_keys(ForumTopic::TAGS))],
            'content' => ['required', 'string', 'min:10', 'max:5000'],
        ]);

        $topic = new ForumTopic($data);
        $topic->user_id = $request->user()->id;
        $topic->status = 'en_revision';
        $topic->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tema enviado. Será visible cuando la administración lo apruebe.']);

        return redirect()->route('comunidades.mis-temas');
    }

    public function show(ForumTopic $topic): Response
    {
        Gate::authorize('view', $topic);

        if ($topic->status === 'publicado') {
            $topic->increment('views');
        }

        $topic->load(['author:id,name', 'replies.author:id,name']);

        return inertia('comunidades/ver', [
            'tema' => $topic,
            'etiquetas' => ForumTopic::TAGS,
            'puedeResponder' => Gate::allows('reply', $topic),
        ]);
    }

    public function reply(Request $request, ForumTopic $topic): RedirectResponse
    {
        Gate::authorize('reply', $topic);

        $data = $request->validate([
            'content' => ['required', 'string', 'min:2', 'max:3000'],
        ]);

        $reply = new ForumReply($data);
        $reply->forum_topic_id = $topic->id;
        $reply->user_id = $request->user()->id;
        $reply->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Respuesta publicada.']);

        return back();
    }
}
