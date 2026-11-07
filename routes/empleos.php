<?php

use App\Http\Controllers\CvDownloadController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\MyCompanyController;
use App\Http\Controllers\MyJobPostingController;
use App\Http\Controllers\ScientificProfileController;
use Illuminate\Support\Facades\Route;

Route::get('empleos', [JobPostingController::class, 'index'])->name('empleos.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('mi-empresa', [MyCompanyController::class, 'edit'])->name('mi-empresa.edit')->middleware('permission:mis empleos');
    Route::put('mi-empresa', [MyCompanyController::class, 'update'])->name('mi-empresa.update')->middleware('permission:mis empleos');
    Route::get('mis-empleos', [MyJobPostingController::class, 'index'])->name('mis-empleos.index')->middleware('permission:mis empleos');
    Route::get('mis-empleos/crear', [MyJobPostingController::class, 'create'])->name('mis-empleos.create')->middleware('permission:crear empleos');
    Route::post('mis-empleos', [MyJobPostingController::class, 'store'])->name('mis-empleos.store')->middleware('permission:crear empleos');
    Route::get('mis-empleos/{jobPosting}/editar', [MyJobPostingController::class, 'edit'])->name('mis-empleos.edit')->middleware('permission:editar empleos');
    Route::put('mis-empleos/{jobPosting}', [MyJobPostingController::class, 'update'])->name('mis-empleos.update')->middleware('permission:editar empleos');
    Route::patch('mis-empleos/{jobPosting}/cerrar', [MyJobPostingController::class, 'close'])->name('mis-empleos.close')->middleware('permission:editar empleos');
    Route::delete('mis-empleos/{jobPosting}', [MyJobPostingController::class, 'destroy'])->name('mis-empleos.destroy')->middleware('permission:eliminar empleos');
    Route::get('mis-empleos/{jobPosting}', [MyJobPostingController::class, 'show'])->name('mis-empleos.show')->middleware('permission:mis empleos');
    Route::get('mis-empleos/{jobPosting}/postulantes', [JobApplicationController::class, 'index'])->name('mis-empleos.postulantes')->middleware('permission:mis empleos');
    Route::patch('postulaciones/{jobApplication}', [JobApplicationController::class, 'update'])->name('postulaciones.update')->middleware('permission:mis empleos');
    Route::post('empleos/{jobPosting}/postular', [JobApplicationController::class, 'store'])->name('empleos.postular');
    Route::get('perfil-profesional', [ScientificProfileController::class, 'edit'])->name('perfil-profesional.edit');
    Route::post('perfil-profesional', [ScientificProfileController::class, 'update'])->name('perfil-profesional.update');
    Route::get('cv/{additionalInformation}', CvDownloadController::class)->name('cv.download');
    Route::get('empleos/{jobPosting}', [JobPostingController::class, 'show'])->name('empleos.show');
});
