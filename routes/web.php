<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/nosotros', 'nosotros')->name('nosotros');

Route::inertia('/terminos-y-condiciones', 'legal/terms')->name('terminos');
Route::inertia('/politica-de-privacidad', 'legal/privacy')->name('politica-privacidad');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/usuarios.php';
require __DIR__.'/empresas.php';
require __DIR__.'/empleos.php';
require __DIR__.'/administrar-empleos.php';
require __DIR__.'/actividades.php';
require __DIR__.'/comunidades.php';
require __DIR__.'/papers.php';
