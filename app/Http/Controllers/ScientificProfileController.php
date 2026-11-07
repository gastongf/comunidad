<?php

namespace App\Http\Controllers;

use App\Models\AdditionalInformation;
use App\Models\Region;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ScientificProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        abort_unless($request->user()->hasRole('Cientifico'), 403);

        return inertia('perfil-profesional/edit', [
            'info' => $request->user()->additionalInformation,
            'hasCv' => filled($request->user()->additionalInformation?->cv_path),
            'regiones' => Region::query()->orderBy('name')->get(['id', 'name']),
            'nivelesPostgrado' => AdditionalInformation::POSTGRAD_LEVELS,
            'requiredFields' => AdditionalInformation::REQUIRED_FIELDS,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        abort_unless($request->user()->hasRole('Cientifico'), 403);

        $current = $request->user()->additionalInformation;

        if ($request->input('postgrad_level') === 'ninguno') {
            $request->merge(['postgrad_level' => null]);
        }

        $data = $request->validate([
            'headline' => ['required', 'string', 'max:255'],
            'profession' => ['required', 'string', 'max:180'],
            'institution' => ['required', 'string', 'max:255'],
            'region_id' => ['required', 'exists:regions,id'],
            'city' => ['required', 'string', 'max:150'],
            'postgrad_level' => ['nullable', Rule::in(array_keys(AdditionalInformation::POSTGRAD_LEVELS))],
            'orcid' => ['nullable', 'regex:/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/', Rule::unique('additional_information', 'orcid')->ignore($current?->id)],
            'cv' => [$current?->cv_path ? 'nullable' : 'required', 'file', 'mimes:pdf', 'max:5120'],
            'open_to_work' => ['required', 'boolean'],
            'is_public' => ['required', 'boolean'],
        ], [
            'orcid.regex' => 'El ORCID debe tener el formato 0000-0000-0000-0000.',
        ]);

        $cv = $request->file('cv');
        unset($data['cv']);

        if ($cv) {
            if ($current?->cv_path) {
                Storage::disk('local')->delete($current->cv_path);
            }
            $data['cv_path'] = $cv->store('cvs', 'local');
        }

        $request->user()->additionalInformation()->updateOrCreate([], $data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Perfil profesional actualizado.']);

        return redirect()->route('perfil-profesional.edit');
    }
}
