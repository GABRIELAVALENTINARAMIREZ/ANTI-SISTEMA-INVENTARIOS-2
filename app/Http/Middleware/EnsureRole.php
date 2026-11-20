<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json([
                'exito' => false,
                'mensaje' => 'Usuario no autenticado.',
            ], 401);
        }

        if (!$usuario->tieneRol(...$roles)) {
            return response()->json([
                'exito' => false,
                'mensaje' => 'Acceso denegado: se requiere uno de los siguientes roles: ['.implode(', ', $roles).']. Tu rol actual es: '.($usuario->rol?->nombre ?? 'Sin rol'),
            ], 403);
        }

        return $next($request);
    }
}
