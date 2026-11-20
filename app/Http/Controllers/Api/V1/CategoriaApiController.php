<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Categoria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoriaApiController extends BaseApiController
{
    public function index(): JsonResponse
    {
        $categorias = Categoria::withCount('productos')->orderBy('nombre', 'asc')->get();
        return $this->respuestaExito($categorias, 'Listado de categorías');
    }

    public function store(Request $request): JsonResponse
    {
        $validador = Validator::make($request->all(), [
            'nombre' => 'required|string|max:80|unique:categorias,nombre',
            'descripcion' => 'nullable|string|max:255',
            'icono' => 'nullable|string|max:40',
            'color' => 'nullable|string|max:20',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Datos de categoría inválidos', 422, $validador->errors());
        }

        $categoria = Categoria::create($validador->validated());
        return $this->respuestaExito($categoria, 'Categoría creada exitosamente', 201);
    }

    public function show(int $id): JsonResponse
    {
        $categoria = Categoria::with('productos')->find($id);
        if (!$categoria) {
            return $this->respuestaError('Categoría no encontrada', 404);
        }
        return $this->respuestaExito($categoria, 'Detalle de categoría');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $categoria = Categoria::find($id);
        if (!$categoria) {
            return $this->respuestaError('Categoría no encontrada', 404);
        }

        $validador = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:80|unique:categorias,nombre,'.$id.',id_categoria',
            'descripcion' => 'nullable|string|max:255',
            'icono' => 'nullable|string|max:40',
            'color' => 'nullable|string|max:20',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Datos inválidos para actualizar', 422, $validador->errors());
        }

        $categoria->update($validador->validated());
        return $this->respuestaExito($categoria, 'Categoría actualizada correctamente');
    }

    public function destroy(int $id): JsonResponse
    {
        $categoria = Categoria::find($id);
        if (!$categoria) {
            return $this->respuestaError('Categoría no encontrada', 404);
        }

        if ($categoria->productos()->exists()) {
            return $this->respuestaError('No se puede eliminar la categoría porque tiene productos asignados', 409);
        }

        $categoria->delete();
        return $this->respuestaExito(null, 'Categoría eliminada');
    }
}
