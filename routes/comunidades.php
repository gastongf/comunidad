<?php

use App\Http\Controllers\ForumTopicController;
use App\Http\Controllers\ForumTopicManageController;
use Illuminate\Support\Facades\Route;

Route::get('comunidades', [ForumTopicController::class, 'index'])->name('comunidades.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('comunidades/crear', [ForumTopicController::class, 'create'])->name('comunidades.create');
    Route::get('mis-temas', [ForumTopicController::class, 'mine'])->name('comunidades.mis-temas');
    Route::post('comunidades', [ForumTopicController::class, 'store'])->name('comunidades.store');
    Route::get('comunidades/{topic}', [ForumTopicController::class, 'show'])->name('comunidades.show');
    Route::post('comunidades/{topic}/respuestas', [ForumTopicController::class, 'reply'])->name('comunidades.reply');

    Route::middleware('permission:moderar comunidades')->group(function () {
        Route::get('administrar-comunidades', [ForumTopicManageController::class, 'index'])->name('administrar-comunidades.index');
        Route::patch('administrar-comunidades/{topic}', [ForumTopicManageController::class, 'moderate'])->name('administrar-comunidades.moderate');
    });
});
