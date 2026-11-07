<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PaperController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->query('tipo');

        if ($request->user() === null) {
            $request->session()->put('url.intended', $request->fullUrl());

            return inertia('publico/vista-previa', [
                'seccion' => 'papers',
                'items' => Paper::query()
                    ->where('type', Paper::TYPE_REQUEST)
                    ->with('user:id,name')
                    ->latest()
                    ->limit(6)
                    ->get(),
            ]);
        }

        $papers = Paper::query()
            ->when(in_array($type, [Paper::TYPE_REQUEST, Paper::TYPE_CONTRIBUTION], true), fn ($query) => $query->where('type', $type))
            ->with('user:id,name')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('papers/index', [
            'papers' => $papers,
            'tipoActivo' => $type,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', Rule::in([Paper::TYPE_REQUEST, Paper::TYPE_CONTRIBUTION])],
            'title' => ['required', 'string', 'max:255'],
            'authors_or_journal' => ['nullable', 'string', 'max:255'],
            'scientific_area' => ['required', 'string', 'max:80'],
            'doi_or_link' => ['nullable', 'required_if:type,'.Paper::TYPE_CONTRIBUTION, 'string', 'max:255'],
            'requester_email' => ['nullable', 'email', 'max:255'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $paper = new Paper($data);
        $paper->user_id = $request->user()->id;
        $paper->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => $data['type'] === Paper::TYPE_REQUEST
            ? 'Solicitud de paper publicada.'
            : 'Gracias por aportar el paper.']);

        return back();
    }

    /**
     * A user answers an open request by contributing a link to the paper.
     */
    public function contribute(Request $request, Paper $paper): RedirectResponse
    {
        abort_unless($paper->type === Paper::TYPE_REQUEST, 404);

        $data = $request->validate([
            'doi_or_link' => ['required', 'string', 'max:255'],
        ]);

        $paper->doi_or_link = $data['doi_or_link'];
        $paper->type = Paper::TYPE_CONTRIBUTION;
        $paper->contributed_by = $request->user()->name;
        $paper->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Gracias por aportar el paper solicitado.']);

        return back();
    }
}
