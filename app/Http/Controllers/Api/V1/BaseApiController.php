<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class BaseApiController extends Controller
{
    /**
     * Respuesta exitosa estándar en formato JSON.
     */
    protected function respuestaExito(mixed $datos = null, string $mensaje = 'Operación realizada con éxito', int $codigo = 200): JsonResponse
    {
        return response()->json([
            'exito' => true,
            'mensaje' => $mensaje,
            'datos' => $datos,
        ], $codigo);
    }

    /**
     * Respuesta de error controlada estándar en formato JSON.
     */
    protected function respuestaError(string $mensaje = 'Ha ocurrido un error en la solicitud', int $codigo = 400, mixed $errores = null): JsonResponse
    {
        $payload = [
            'exito' => false,
            'mensaje' => $mensaje,
        ];

        if ($errores !== null) {
            $payload['errores'] = $errores;
        }

        return response()->json($payload, $codigo);
    }
}
