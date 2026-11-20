<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Movimiento;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MovimientoApiController extends BaseApiController
{
    /**
     * Listar movimientos de inventario con filtros de Kardex.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Movimiento::with(['usuario', 'proveedor', 'detalles.producto']);

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->input('tipo'));
        }

        if ($request->filled('subtipo')) {
            $query->where('subtipo', $request->input('subtipo'));
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha', '>=', $request->input('fecha_desde'));
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha', '<=', $request->input('fecha_hasta'));
        }

        $movimientos = $query->orderBy('fecha', 'desc')->paginate((int) $request->input('por_pagina', 25));

        return $this->respuestaExito($movimientos, 'Historial de movimientos obtenido');
    }

    /**
     * Registrar un movimiento atómico (cabecera + detalle + actualización de stock).
     */
    public function store(Request $request): JsonResponse
    {
        $validador = Validator::make($request->all(), [
            'tipo' => 'required|in:entrada,salida',
            'subtipo' => 'required|string|max:60',
            'id_proveedor' => 'nullable|integer|exists:proveedores,id_proveedor',
            'observacion' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.id_producto' => 'required|integer|exists:productos,id_producto',
            'detalles.*.cantidad' => 'required|numeric|gt:0',
            'detalles.*.costo_unitario' => 'required|numeric|min:0',
        ], [
            'detalles.required' => 'Debe incluir al menos un ítem en los detalles del movimiento.',
            'detalles.*.id_producto.exists' => 'Uno de los productos indicados no existe en el catálogo.',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Datos de movimiento inválidos', 422, $validador->errors());
        }

        $tipo = $request->input('tipo');
        $detalles = $request->input('detalles');
        $usuario = $request->user();

        // Transacción de base de datos para garantizar consistencia atómica
        DB::beginTransaction();

        try {
            $totalCOP = 0;

            // Pre-validar existencia y stock para salidas
            foreach ($detalles as $item) {
                $subtotal = $item['cantidad'] * $item['costo_unitario'];
                $totalCOP += $subtotal;

                if ($tipo === 'salida') {
                    $producto = Producto::lockForUpdate()->find($item['id_producto']);
                    if ($producto->cantidad < $item['cantidad']) {
                        DB::rollBack();
                        return $this->respuestaError(
                            "Stock insuficiente para '{$producto->nombre}'. Disponible: {$producto->cantidad} {$producto->unidad_medida}, Solicitado: {$item['cantidad']}",
                            422
                        );
                    }
                }
            }

            // Crear cabecera de movimiento
            $movimiento = Movimiento::create([
                'tipo' => $tipo,
                'subtipo' => $request->input('subtipo'),
                'id_proveedor' => $request->input('id_proveedor'),
                'id_usuario' => $usuario->id_usuario,
                'observacion' => $request->input('observacion'),
                'total_cop' => $totalCOP,
                'fecha' => now(),
            ]);

            // Insertar detalles y actualizar stock de productos
            foreach ($detalles as $item) {
                $movimiento->detalles()->create([
                    'id_producto' => $item['id_producto'],
                    'cantidad' => $item['cantidad'],
                    'costo_unitario' => $item['costo_unitario'],
                ]);

                // Actualizar stock de forma atómica
                $producto = Producto::find($item['id_producto']);
                if ($tipo === 'entrada') {
                    $producto->increment('cantidad', $item['cantidad']);
                } else {
                    $producto->decrement('cantidad', $item['cantidad']);
                }
            }

            DB::commit();

            $movimiento->load(['usuario', 'proveedor', 'detalles.producto']);

            return $this->respuestaExito($movimiento, 'Movimiento de inventario procesado exitosamente', 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->respuestaError('Error interno al registrar el movimiento: '.$e->getMessage(), 500);
        }
    }

    /**
     * Consultar detalle de un movimiento.
     */
    public function show(int $id): JsonResponse
    {
        $movimiento = Movimiento::with(['usuario', 'proveedor', 'detalles.producto'])->find($id);

        if (!$movimiento) {
            return $this->respuestaError('Movimiento no encontrado', 404);
        }

        return $this->respuestaExito($movimiento, 'Detalle de movimiento obtenido');
    }
}
