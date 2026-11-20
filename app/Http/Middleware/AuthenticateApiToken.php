<?php

namespace App\Http\Middleware;

use App\Models\PersonalAccessToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return response()->json([
                'exito' => false,
                'mensaje' => 'Token de autenticación no proporcionado. Debe incluir la cabecera: Authorization: Bearer <token>',
            ], 401);
        }

        $plainToken = substr($header, 7);
        $tokenHash = hash('sha256', $plainToken);

        $tokenRecord = PersonalAccessToken::with(['usuario.rol'])
            ->where('token', $tokenHash)
            ->first();

        if (!$tokenRecord) {
            return response()->json([
                'exito' => false,
                'mensaje' => 'Token de acceso no válido o revocado.',
            ], 401);
        }

        if ($tokenRecord->haExpirado()) {
            return response()->json([
                'exito' => false,
                'mensaje' => 'El token de acceso ha expirado. Por favor inicie sesión nuevamente.',
            ], 401);
        }

        $usuario = $tokenRecord->usuario;

        if (!$usuario || $usuario->estado !== 'Activo') {
            return response()->json([
                'exito' => false,
                'mensaje' => 'La cuenta de usuario asociada a este token se encuentra inactiva.',
            ], 403);
        }

        // Registrar último uso del token
        $tokenRecord->update(['ultimo_uso' => now()]);

        // Autenticar usuario en la petición
        $request->setUserResolver(fn() => $usuario);
        $request->attributes->set('auth_token', $tokenRecord);

        return $next($request);
    }
}
