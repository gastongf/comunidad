<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MyCompanyController extends Controller
{
    public function edit(Request $request): Response
    {
        $company = $request->user()->company()->firstOrFail();

        return Inertia::render('mi-empresa/editar', [
            'empresa' => $company->load('owner:id,name,email'),
            'regions' => Region::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $company = $request->user()->company()->firstOrFail();

        $data = $request->validate([
            'name_company' => 'required|string|max:255',
            'region_id' => 'required|exists:regions,id',
            'rut' => ['required', 'string', 'max:12', Rule::unique('companies', 'rut')->ignore($company->id)],
            'website' => 'nullable|url|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string|max:1000',
        ]);

        $attributes = [
            'name' => $data['name_company'],
            'region_id' => $data['region_id'],
            'rut' => $data['rut'],
            'website' => $data['website'] ?? null,
            'description' => $data['description'] ?? null,
        ];

        if ($request->hasFile('logo')) {
            if ($company->logo_path) {
                Storage::disk('public')->delete($company->logo_path);
            }
            $attributes['logo_path'] = $request->file('logo')->store('companies', 'public');
        }

        $company->update($attributes);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Datos de la empresa actualizados.']);

        return to_route('mi-empresa.edit');
    }
}
