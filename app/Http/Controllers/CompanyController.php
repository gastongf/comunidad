<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Region;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->query('estado') === 'eliminadas' ? 'eliminadas' : 'activas';

        $empresas = Company::query()
            ->with(['owner:id,name,email', 'region:id,name'])
            ->withCount('jobPostings')
            ->when($filter === 'eliminadas', fn ($query) => $query->onlyTrashed())
            ->when($request->query('buscar'), function ($query, string $term) {
                $query->where(function ($query) use ($term) {
                    $query->where('name', 'like', "%{$term}%")->orWhere('rut', 'like', "%{$term}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('empresas/index', [
            'empresas' => $empresas,
            'filters' => ['estado' => $filter, 'buscar' => $request->query('buscar', '')],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('empresas/crear', [
            'regions' => Region::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name_user' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'name_company' => 'required|string|max:255',
            'region_id' => 'required|exists:regions,id',
            'rut' => 'required|string|max:12|unique:companies,rut',
            'website' => 'nullable|url|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string|max:1000',
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
        ]);

        DB::transaction(function () use ($data, $request) {
            $user = User::create([
                'name' => $data['name_user'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);
            $user->assignRole('Empresa');

            Company::create([
                'owner_id' => $user->id,
                'name' => $data['name_company'],
                'region_id' => $data['region_id'],
                'rut' => $data['rut'],
                'website' => $data['website'] ?? null,
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? 'active',
                'logo_path' => $request->file('logo')?->store('companies', 'public'),
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Empresa creada exitosamente.']);

        return to_route('empresas.index');
    }

    public function edit(Company $empresa): Response
    {
        return Inertia::render('empresas/editar', [
            'empresa' => $empresa->load('owner:id,name,email'),
            'regions' => Region::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Company $empresa): RedirectResponse
    {
        $data = $request->validate([
            'name_company' => 'required|string|max:255',
            'region_id' => 'required|exists:regions,id',
            'rut' => ['required', 'string', 'max:12', Rule::unique('companies', 'rut')->ignore($empresa->id)],
            'website' => 'nullable|url|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string|max:1000',
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        $attributes = [
            'name' => $data['name_company'],
            'region_id' => $data['region_id'],
            'rut' => $data['rut'],
            'website' => $data['website'] ?? null,
            'description' => $data['description'] ?? null,
            'status' => $data['status'],
        ];

        if ($request->hasFile('logo')) {
            if ($empresa->logo_path) {
                Storage::disk('public')->delete($empresa->logo_path);
            }
            $attributes['logo_path'] = $request->file('logo')->store('companies', 'public');
        }

        $empresa->update($attributes);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Empresa actualizada.']);

        return to_route('empresas.index');
    }

    public function destroy(Company $empresa): RedirectResponse
    {
        $empresa->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Empresa eliminada.']);

        return to_route('empresas.index');
    }

    public function restore(int $empresa): RedirectResponse
    {
        Company::onlyTrashed()->findOrFail($empresa)->restore();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Empresa restaurada.']);

        return to_route('empresas.index');
    }
}
