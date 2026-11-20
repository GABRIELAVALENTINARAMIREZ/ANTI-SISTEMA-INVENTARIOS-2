<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\MovementController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;

/*
|--------------------------------------------------------------------------
| Web Routes - Sistema de Inventarios GAMA (FastStock)
|--------------------------------------------------------------------------
*/

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/inventario', [ProductController::class, 'index'])->name('inventario.index');
Route::get('/categorias', [CategoryController::class, 'index'])->name('categorias.index');
Route::get('/proveedores', [SupplierController::class, 'index'])->name('proveedores.index');
Route::get('/movimientos', [MovementController::class, 'index'])->name('movimientos.index');
Route::get('/recetas', [RecipeController::class, 'index'])->name('recetas.index');
Route::get('/lotes', [BatchController::class, 'index'])->name('lotes.index');
Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
Route::get('/reportes', [ReportController::class, 'index'])->name('reportes.index');
