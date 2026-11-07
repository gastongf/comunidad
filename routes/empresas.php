<?php

use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('empresas', [CompanyController::class, 'index'])->name('empresas.index')->middleware('permission:ver empresas|crear empresas|editar empresas|eliminar empresas');
    Route::get('empresas/crear', [CompanyController::class, 'create'])->name('empresas.create')->middleware('permission:crear empresas');
    Route::post('empresas', [CompanyController::class, 'store'])->name('empresas.store')->middleware('permission:crear empresas');
    Route::get('empresas/{empresa}/editar', [CompanyController::class, 'edit'])->name('empresas.edit')->whereNumber('empresa')->middleware('permission:editar empresas');
    Route::put('empresas/{empresa}', [CompanyController::class, 'update'])->name('empresas.update')->whereNumber('empresa')->middleware('permission:editar empresas');
    Route::delete('empresas/{empresa}', [CompanyController::class, 'destroy'])->name('empresas.destroy')->whereNumber('empresa')->middleware('permission:eliminar empresas');
    Route::patch('empresas/{empresa}/restaurar', [CompanyController::class, 'restore'])->name('empresas.restore')->whereNumber('empresa')->middleware('permission:eliminar empresas');
});
