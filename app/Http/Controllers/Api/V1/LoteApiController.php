<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Lote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LoteApiController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $query = Lote::with(['producto', 'ubicacion']);

        if ($request->filled('id_producto')) {
            $query->where('id_producto', $request->input('id_producto'));
        }

        if ($request->boolean('vigentes_solamente', false)) {
            $query->where('dado_de_baja', false)->where('fecha_vencimiento', '>=', now());
        }

        $lotes = $query->orderBy('fecha_vencimiento', 'asc')->get();

        return $this->respuestaExito($lotes, 'Listado de lotes y trazabilidad');
    }

    public function store(Request $request): JsonResponse
    {
        $validador = Validator::make($request->all(), [
            'numero_lote' => 'required|string|max:50|unique:lotes,numero_lote',
            'id_producto' => 'required|integer|exists:productos,id_producto',
            'cantidad' => 'required|numeric|min:0',
            'fecha_ingreso' => 'required|date',
            'fecha_vencimiento' => 'required|date|after_or_equal:fecha_ingreso',
            'id_ubicacion' => 'nullable|integer|exists:ubicaciones,id_ubicacion',
        ], [
            'numero_lote.unique' => 'El número de lote ya se encuentra registrado.',
            'fecha_vencimiento.after_or_equal' => 'La fecha de vencimiento no puede ser anterior a la fecha de ingreso.',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Datos del lote inválidos', 422, $validador->errors());
        }

        $lote = Lote::create($validador->validated());
        $lote->load(['producto', 'ubicacion']);

        return $this->respuestaExito($lote, 'Lote registrado exitosamente', 201);
    }

    public function show(int $id): JsonResponse
    {
        $lote = Lote::with(['producto', 'ubicacion'])->find($id);

        if (!$lote) {
            return $this->respuestaError('Lote no encontrado', 404);
        }

        return $this->respuestaExito($lote, 'Detalle de lote');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $lote = Lote::find($id);

        if (!$lote) {
            return $this->respuestaError('Lote no encontrado', 404);
        }

        $validador = Validator::make($request->all(), [
            'numero_lote' => 'sometimes|required|string|max:50|unique:lotes,numero_lote,'.$id.',id_lote',
            'cantidad' => 'sometimes|required|numeric|min:0',
            'fecha_ingreso' => 'sometimes|required|date',
            'fecha_vencimiento' => 'sometimes|required|date',
            'id_ubicacion' => 'nullable|integer|exists:ubicaciones,id_ubicacion',
            'dado_de_baja' => 'nullable|boolean',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Error en los datos del lote', 422, $validador->errors());
        }

        $lote->update($validador->validated());
        $lote->load(['producto', 'ubicacion']);

        return $this->respuestaExito($lote, 'Lote actualizado correctamente');
    }

    public function destroy(int $id): JsonResponse
    {
        $lote = Lote::find($id);

        if (!$lote) {
            return $this->respuestaError('Lote no encontrado', 404);
        }

        $lote->delete();

        return $this->respuestaExito(null, 'Lote eliminado');
    }
}
