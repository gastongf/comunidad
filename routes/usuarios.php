<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;




Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('usuarios', [UserController::class, 'index'])->name('usuarios.index')->middleware('permission:ver usuarios|crear usuarios|editar usuarios|eliminar usuarios');
  Route::get('usuarios/crear', [UserController::class, 'create'])->name('usuarios.create')->middleware('permission:crear usuarios');
  Route::post('usuarios', [UserController::class, 'store'])->name('usuarios.store')->middleware('permission:crear usuarios');
  Route::get('usuarios/{usuario}/editar', [UserController::class, 'edit'])->name('usuarios.edit')->middleware('permission:editar usuarios');
  Route::put('usuarios/{usuario}', [UserController::class, 'update'])->name('usuarios.update')->middleware('permission:editar usuarios');
  Route::delete('usuarios/{usuario}', [UserController::class, 'destroy'])->name('usuarios.destroy')->middleware('permission:eliminar usuarios');
});
