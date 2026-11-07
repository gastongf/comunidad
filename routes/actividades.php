<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ActivityManageController;
use Illuminate\Support\Facades\Route;

Route::get('actividades', [ActivityController::class, 'index'])->name('actividades.index');

Route::get('actividades/{activity}', [ActivityController::class, 'show'])->whereNumber('activity')->name('actividades.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('actividades/crear', [ActivityController::class, 'create'])->name('actividades.create');
    Route::get('mis-actividades', [ActivityController::class, 'mine'])->name('actividades.mias');
    Route::post('actividades', [ActivityController::class, 'store'])->name('actividades.store');

    Route::middleware('permission:moderar actividades')->group(function () {
        Route::get('administrar-actividades', [ActivityManageController::class, 'index'])->name('administrar-actividades.index');
        Route::patch('administrar-actividades/{activity}', [ActivityManageController::class, 'moderate'])->name('administrar-actividades.moderate');
        Route::delete('administrar-actividades/{activity}', [ActivityManageController::class, 'destroy'])->name('administrar-actividades.destroy');
    });
});
