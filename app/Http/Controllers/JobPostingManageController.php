<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingManageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // seleccionamos todos los empleos pendientes o rechazados
        $jobPostings = JobPosting::whereIn('status', ['pendiente', 'rechazado'])->with('category')->paginate(6);

        // Si la página solicitada no existe, redirigimos a la última disponible
        if (request()->has('page') && request()->integer('page') > $jobPostings->lastPage()) {
            return redirect()->to(
                request()->url().'?page='.$jobPostings->lastPage()
            );
        }

        return inertia('administrar-empleos/index', [
            'trabajosPendientes' => $jobPostings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $jobPosting = JobPosting::findOrFail($id);
        if ($jobPosting->status === 'rechazado') {
            return redirect()->route('administrar-empleos.index');
        }

        return inertia('administrar-empleos/ver', [
            'trabajo' => $jobPosting,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function aprobar(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:job_postings,id',
        ]);

        $jobPosting = JobPosting::findOrFail($request->id);
        $jobPosting->status = 'publicado';
        $jobPosting->approved_by = $request->user()->id;
        $jobPosting->rejection_reason = null;
        $jobPosting->save();

        return redirect()->route('administrar-empleos.index')->with('success', 'Empleo aprobado correctamente.');
    }

    public function rechazar(Request $request)
    {

        $request->validate([
            'id' => 'required|exists:job_postings,id',
            'motivo' => 'required|string',
        ]);

        $motivo = $request->input('motivo');

        $jobPosting = JobPosting::findOrFail($request->id);
        $jobPosting->status = 'rechazado';
        $jobPosting->rejection_reason = $motivo;
        $jobPosting->save();

        return redirect()->route('administrar-empleos.index')->with('success', 'Empleo rechazado correctamente.');
    }
}
