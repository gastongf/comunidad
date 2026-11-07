<?php

use App\Http\Controllers\JobPostingManageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('administrar-empleos', [JobPostingManageController::class, 'index'])->name('administrar-empleos.index')->middleware('permission:administrar empleos');
    Route::get('administrar-empleos/{id}', [JobPostingManageController::class, 'show'])->name('administrar-empleos.show')->middleware('permission:administrar empleos');
    Route::post('administrar-empleos/rechazar', [JobPostingManageController::class, 'rechazar'])->name('administrar-empleos.rechazar')->middleware('permission:administrar empleos');
    Route::post('administrar-empleos/aprobar', [JobPostingManageController::class, 'aprobar'])->name('administrar-empleos.aprobar')->middleware('permission:administrar empleos');
});
