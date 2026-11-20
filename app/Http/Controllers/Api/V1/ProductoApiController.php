<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductoApiController extends BaseApiController
{
    /**
     * Listar productos con filtros y relaciones.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Producto::with(['categoria', 'proveedor', 'ubicacion']);

        // Filtro por categoría
        if ($request->filled('id_categoria')) {
            $query->where('id_categoria', $request->input('id_categoria'));
        }

        // Filtro por proveedor
        if ($request->filled('id_proveedor')) {
            $query->where('id_proveedor', $request->input('id_proveedor'));
        }

        // Filtro por ubicación
        if ($request->filled('id_ubicacion')) {
            $query->where('id_ubicacion', $request->input('id_ubicacion'));
        }

        // Filtro por estado de stock
        if ($request->filled('estado')) {
            $estado = $request->input('estado');
            if ($estado === 'agotado') {
                $query->where('cantidad', '<=', 0);
            } elseif ($estado === 'bajo_stock') {
                $query->whereColumn('cantidad', '<=', 'stock_minimo')->where('cantidad', '>', 0);
            } elseif ($estado === 'disponible') {
                $query->whereColumn('cantidad', '>', 'stock_minimo');
            }
        }

        // Búsqueda por nombre o código (consulta parametrizada)
        if ($request->filled('buscar')) {
            $termino = trim($request->input('buscar'));
            $query->where(function ($q) use ($termino) {
                $q->where('nombre', 'LIKE', "%{$termino}%")
                  ->orWhere('codigo', 'LIKE', "%{$termino}%");
            });
        }

        $perPage = (int) $request->input('por_pagina', 20);
        $productos = $query->orderBy('nombre', 'asc')->paginate($perPage);

        return $this->respuestaExito($productos, 'Catálogo de productos obtenido');
    }

    /**
     * Crear un nuevo producto en el inventario.
     */
    public function store(Request $request): JsonResponse
    {
        $validador = Validator::make($request->all(), [
            'codigo' => 'required|string|max:30|unique:productos,codigo',
            'nombre' => 'required|string|max:150',
            'imagen' => 'nullable|string|max:255',
            'id_categoria' => 'required|integer|exists:categorias,id_categoria',
            'id_proveedor' => 'required|integer|exists:proveedores,id_proveedor',
            'id_ubicacion' => 'nullable|integer|exists:ubicaciones,id_ubicacion',
            'cantidad' => 'required|numeric|min:0',
            'unidad_medida' => 'required|string|max:30',
            'stock_minimo' => 'required|numeric|min:0',
            'precio_compra' => 'required|numeric|min:0',
        ], [
            'codigo.unique' => 'El código ingresado ya está asignado a otro producto.',
            'id_categoria.exists' => 'La categoría seleccionada no existe en la base de datos.',
            'id_proveedor.exists' => 'El proveedor seleccionado no existe en la base de datos.',
            'id_ubicacion.exists' => 'La ubicación seleccionada no es válida.',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Datos de producto inválidos', 422, $validador->errors());
        }

        $producto = Producto::create($validador->validated());
        $producto->load(['categoria', 'proveedor', 'ubicacion']);

        return $this->respuestaExito($producto, 'Producto creado exitosamente', 201);
    }

    /**
     * Obtener el detalle de un producto específico.
     */
    public function show(int $id): JsonResponse
    {
        $producto = Producto::with(['categoria', 'proveedor', 'ubicacion', 'lotes' => function ($q) {
            $q->where('dado_de_baja', false)->orderBy('fecha_vencimiento', 'asc');
        }])->find($id);

        if (!$producto) {
            return $this->respuestaError('Producto no encontrado', 404);
        }

        return $this->respuestaExito($producto, 'Detalle de producto obtenido');
    }

    /**
     * Actualizar los datos de un producto.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $producto = Producto::find($id);

        if (!$producto) {
            return $this->respuestaError('Producto no encontrado para actualizar', 404);
        }

        $validador = Validator::make($request->all(), [
            'codigo' => 'sometimes|required|string|max:30|unique:productos,codigo,'.$id.',id_producto',
            'nombre' => 'sometimes|required|string|max:150',
            'imagen' => 'nullable|string|max:255',
            'id_categoria' => 'sometimes|required|integer|exists:categorias,id_categoria',
            'id_proveedor' => 'sometimes|required|integer|exists:proveedores,id_proveedor',
            'id_ubicacion' => 'nullable|integer|exists:ubicaciones,id_ubicacion',
            'cantidad' => 'sometimes|required|numeric|min:0',
            'unidad_medida' => 'sometimes|required|string|max:30',
            'stock_minimo' => 'sometimes|required|numeric|min:0',
            'precio_compra' => 'sometimes|required|numeric|min:0',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Error de validación al actualizar', 422, $validador->errors());
        }

        $producto->update($validador->validated());
        $producto->load(['categoria', 'proveedor', 'ubicacion']);

        return $this->respuestaExito($producto, 'Producto actualizado correctamente');
    }

    /**
     * Eliminar un producto protegiendo la integridad referencial.
     */
    public function destroy(int $id): JsonResponse
    {
        $producto = Producto::find($id);

        if (!$producto) {
            return $this->respuestaError('Producto no encontrado', 404);
        }

        // Validar si tiene registros históricos vinculados
        if ($producto->detallesMovimiento()->exists() || $producto->detallesReceta()->exists() || $producto->lotes()->exists()) {
            return $this->respuestaError(
                'No se puede eliminar el producto porque tiene movimientos de inventario, recetas o lotes asociados. Considere ajustar su stock a 0.',
                409
            );
        }

        $producto->delete();

        return $this->respuestaExito(null, 'Producto eliminado exitosamente', 200);
    }
}
