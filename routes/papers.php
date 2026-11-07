<?php

use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\PaperController;
use Illuminate\Support\Facades\Route;

Route::get('papers', [PaperController::class, 'index'])->name('papers.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('papers', [PaperController::class, 'store'])->name('papers.store');
    Route::patch('papers/{paper}/aportar', [PaperController::class, 'contribute'])->name('papers.contribute');

    Route::get('contacto', [ContactMessageController::class, 'create'])->name('contacto.create');
    Route::post('contacto', [ContactMessageController::class, 'store'])->name('contacto.store');
    Route::get('mensajes-contacto', [ContactMessageController::class, 'index'])
        ->name('mensajes-contacto.index')
        ->middleware('permission:ver mensajes de contacto');
});
