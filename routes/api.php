<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProductoApiController;
use App\Http\Controllers\Api\V1\CategoriaApiController;
use App\Http\Controllers\Api\V1\ProveedorApiController;
use App\Http\Controllers\Api\V1\MovimientoApiController;
use App\Http\Controllers\Api\V1\LoteApiController;
use App\Http\Controllers\Api\V1\RecetaApiController;

/*
|--------------------------------------------------------------------------
| API Routes - Sistema de Inventarios GAMA (FastStock) - Versión 1 (v1)
|--------------------------------------------------------------------------
|
| Todas las rutas de esta sección están prefijadas con '/api/v1'.
| Siguen las convenciones RESTful estándar con respuestas JSON consistentes.
|
*/

Route::prefix('v1')->group(function () {

    // =========================================================================
    // 1. RUTAS PÚBLICAS (AUTENTICACIÓN)
    // =========================================================================
    Route::post('/auth/login', [AuthController::class, 'login']);

    // =========================================================================
    // 2. RUTAS PROTEGIDAS MEDIANTE TOKEN BEARER (auth.api)
    // =========================================================================
    Route::middleware('auth.api')->group(function () {

        // Sesión y Perfil del usuario
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/perfil', [AuthController::class, 'perfil']);

        // ---------------------------------------------------------------------
        // CONSULTAS DE LECTURA (Administrador, Encargado de inventario, Empleado)
        // ---------------------------------------------------------------------
        Route::get('/productos', [ProductoApiController::class, 'index']);
        Route::get('/productos/{id}', [ProductoApiController::class, 'show']);

        Route::get('/categorias', [CategoriaApiController::class, 'index']);
        Route::get('/categorias/{id}', [CategoriaApiController::class, 'show']);

        Route::get('/proveedores', [ProveedorApiController::class, 'index']);
        Route::get('/proveedores/{id}', [ProveedorApiController::class, 'show']);

        Route::get('/recetas', [RecetaApiController::class, 'index']);
        Route::get('/recetas/{id}', [RecetaApiController::class, 'show']);

        Route::get('/lotes', [LoteApiController::class, 'index']);
        Route::get('/lotes/{id}', [LoteApiController::class, 'show']);

        Route::get('/movimientos', [MovimientoApiController::class, 'index']);
        Route::get('/movimientos/{id}', [MovimientoApiController::class, 'show']);

        // Registro de movimientos (Permitido para todos los roles autorizados)
        Route::post('/movimientos', [MovimientoApiController::class, 'store']);

        // ---------------------------------------------------------------------
        // GESTIÓN DE INVENTARIO Y CATÁLOGO (Administrador, Encargado de inventario)
        // ---------------------------------------------------------------------
        Route::middleware('role:Administrador,Encargado de inventario')->group(function () {
            // Productos
            Route::post('/productos', [ProductoApiController::class, 'store']);
            Route::put('/productos/{id}', [ProductoApiController::class, 'update']);
            Route::patch('/productos/{id}', [ProductoApiController::class, 'update']);

            // Categorías
            Route::post('/categorias', [CategoriaApiController::class, 'store']);
            Route::put('/categorias/{id}', [CategoriaApiController::class, 'update']);

            // Proveedores
            Route::post('/proveedores', [ProveedorApiController::class, 'store']);
            Route::put('/proveedores/{id}', [ProveedorApiController::class, 'update']);

            // Lotes
            Route::post('/lotes', [LoteApiController::class, 'store']);
            Route::put('/lotes/{id}', [LoteApiController::class, 'update']);

            // Recetas
            Route::post('/recetas', [RecetaApiController::class, 'store']);
            Route::put('/recetas/{id}', [RecetaApiController::class, 'update']);
        });

        // ---------------------------------------------------------------------
        // OPERACIONES DE ALTO IMPACTO / ELIMINACIÓN (Solo Administrador)
        // ---------------------------------------------------------------------
        Route::middleware('role:Administrador')->group(function () {
            Route::delete('/productos/{id}', [ProductoApiController::class, 'destroy']);
            Route::delete('/categorias/{id}', [CategoriaApiController::class, 'destroy']);
            Route::delete('/proveedores/{id}', [ProveedorApiController::class, 'destroy']);
            Route::delete('/lotes/{id}', [LoteApiController::class, 'destroy']);
            Route::delete('/recetas/{id}', [RecetaApiController::class, 'destroy']);
        });

    });

});
