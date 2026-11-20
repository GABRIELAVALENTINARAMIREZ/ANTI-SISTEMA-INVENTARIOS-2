<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Receta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RecetaApiController extends BaseApiController
{
    public function index(): JsonResponse
    {
        $recetas = Receta::with('ingredientes.producto')->orderBy('nombre', 'asc')->get();
        return $this->respuestaExito($recetas, 'Recetario culinario');
    }

    public function store(Request $request): JsonResponse
    {
        $validador = Validator::make($request->all(), [
            'nombre' => 'required|string|max:120|unique:recetas,nombre',
            'categoria_menu' => 'required|string|max:80',
            'precio_venta' => 'required|numeric|min:0',
            'tiempo_preparacion_min' => 'nullable|integer|min:1',
            'ingredientes' => 'required|array|min:1',
            'ingredientes.*.id_producto' => 'required|integer|exists:productos,id_producto',
            'ingredientes.*.cantidad' => 'required|numeric|gt:0',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Datos de receta inválidos', 422, $validador->errors());
        }

        DB::beginTransaction();
        try {
            $receta = Receta::create([
                'nombre' => $request->input('nombre'),
                'categoria_menu' => $request->input('categoria_menu'),
                'precio_venta' => $request->input('precio_venta'),
                'tiempo_preparacion_min' => $request->input('tiempo_preparacion_min', 10),
            ]);

            foreach ($request->input('ingredientes') as $ing) {
                $receta->ingredientes()->create([
                    'id_producto' => $ing['id_producto'],
                    'cantidad' => $ing['cantidad'],
                ]);
            }

            DB::commit();

            $receta->load('ingredientes.producto');
            return $this->respuestaExito($receta, 'Receta creada exitosamente', 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->respuestaError('Error al crear receta: '.$e->getMessage(), 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $receta = Receta::with('ingredientes.producto')->find($id);

        if (!$receta) {
            return $this->respuestaError('Receta no encontrada', 404);
        }

        return $this->respuestaExito($receta, 'Detalle de receta');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $receta = Receta::find($id);

        if (!$receta) {
            return $this->respuestaError('Receta no encontrada', 404);
        }

        $validador = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:120|unique:recetas,nombre,'.$id.',id_receta',
            'categoria_menu' => 'sometimes|required|string|max:80',
            'precio_venta' => 'sometimes|required|numeric|min:0',
            'tiempo_preparacion_min' => 'nullable|integer|min:1',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Datos inválidos para actualizar', 422, $validador->errors());
        }

        $receta->update($validador->validated());
        $receta->load('ingredientes.producto');

        return $this->respuestaExito($receta, 'Receta actualizada');
    }

    public function destroy(int $id): JsonResponse
    {
        $receta = Receta::find($id);

        if (!$receta) {
            return $this->respuestaError('Receta no encontrada', 404);
        }

        $receta->delete();

        return $this->respuestaExito(null, 'Receta eliminada correctamente');
    }
}
