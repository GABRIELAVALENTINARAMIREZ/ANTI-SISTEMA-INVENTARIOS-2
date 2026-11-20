<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Proveedor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProveedorApiController extends BaseApiController
{
    public function index(): JsonResponse
    {
        $proveedores = Proveedor::withCount('productos')->orderBy('nombre', 'asc')->get();
        return $this->respuestaExito($proveedores, 'Directorio de proveedores');
    }

    public function store(Request $request): JsonResponse
    {
        $validador = Validator::make($request->all(), [
            'nombre' => 'required|string|max:150',
            'nit' => 'required|string|max:30|unique:proveedores,nit',
            'telefono' => 'nullable|string|max:30',
            'correo' => 'nullable|email|max:120',
            'direccion' => 'nullable|string|max:200',
            'productos_suministrados' => 'nullable|array',
            'estado' => 'nullable|in:Activo,Inactivo',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Datos de proveedor inválidos', 422, $validador->errors());
        }

        $proveedor = Proveedor::create($validador->validated());
        return $this->respuestaExito($proveedor, 'Proveedor registrado exitosamente', 201);
    }

    public function show(int $id): JsonResponse
    {
        $proveedor = Proveedor::with('productos')->find($id);
        if (!$proveedor) {
            return $this->respuestaError('Proveedor no encontrado', 404);
        }
        return $this->respuestaExito($proveedor, 'Detalle de proveedor');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $proveedor = Proveedor::find($id);
        if (!$proveedor) {
            return $this->respuestaError('Proveedor no encontrado', 404);
        }

        $validador = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:150',
            'nit' => 'sometimes|required|string|max:30|unique:proveedores,nit,'.$id.',id_proveedor',
            'telefono' => 'nullable|string|max:30',
            'correo' => 'nullable|email|max:120',
            'direccion' => 'nullable|string|max:200',
            'productos_suministrados' => 'nullable|array',
            'estado' => 'nullable|in:Activo,Inactivo',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Error al actualizar datos de proveedor', 422, $validador->errors());
        }

        $proveedor->update($validador->validated());
        return $this->respuestaExito($proveedor, 'Proveedor actualizado correctamente');
    }

    public function destroy(int $id): JsonResponse
    {
        $proveedor = Proveedor::find($id);
        if (!$proveedor) {
            return $this->respuestaError('Proveedor no encontrado', 404);
        }

        if ($proveedor->productos()->exists() || $proveedor->movimientos()->exists()) {
            return $this->respuestaError('No se puede eliminar el proveedor porque tiene productos o movimientos vinculados', 409);
        }

        $proveedor->delete();
        return $this->respuestaExito(null, 'Proveedor eliminado correctamente');
    }
}
