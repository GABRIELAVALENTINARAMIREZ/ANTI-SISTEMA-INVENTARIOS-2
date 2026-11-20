<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends BaseApiController
{
    /**
     * Inicio de sesión para emitir token Bearer seguro.
     */
    public function login(Request $request): JsonResponse
    {
        $validador = Validator::make($request->all(), [
            'identificador' => 'required|string',
            'password' => 'required|string',
            'dispositivo' => 'nullable|string|max:80',
        ], [
            'identificador.required' => 'Debe ingresar su nombre de usuario o correo electrónico.',
            'password.required' => 'Debe ingresar su contraseña.',
        ]);

        if ($validador->fails()) {
            return $this->respuestaError('Datos de autenticación incompletos', 422, $validador->errors());
        }

        $identificador = $request->input('identificador');
        $password = $request->input('password');

        // Buscar por usuario o correo de forma parametrizada (prevención de SQL Injection)
        $usuario = User::with('rol')
            ->where(function ($query) use ($identificador) {
                $query->where('usuario', $identificador)
                      ->orWhere('correo', $identificador);
            })
            ->first();

        if (!$usuario || !Hash::check($password, $usuario->password_hash)) {
            return $this->respuestaError('Credenciales inválidas. Verifique sus datos de acceso.', 401);
        }

        if ($usuario->estado !== 'Activo') {
            return $this->respuestaError('Su cuenta se encuentra inactiva. Comuníquese con el administrador.', 403);
        }

        // Registrar acceso
        $usuario->update(['ultimo_acceso' => now()]);

        // Crear token de portador seguro (expira en 8 horas = 480 minutos)
        $nombreToken = $request->input('dispositivo', 'API Client - '.now()->toDateString());
        $tokenPlano = $usuario->crearTokenApi($nombreToken, ['*'], 480);

        return $this->respuestaExito([
            'token_acceso' => $tokenPlano,
            'tipo_token' => 'Bearer',
            'expira_en_minutos' => 480,
            'usuario' => [
                'id_usuario' => $usuario->id_usuario,
                'nombre' => $usuario->nombre,
                'usuario' => $usuario->usuario,
                'correo' => $usuario->correo,
                'rol' => $usuario->rol?->nombre,
                'avatar' => $usuario->avatar,
            ],
        ], 'Autenticación exitosa. Token generado.');
    }

    /**
     * Cierre de sesión y revocación del token en uso.
     */
    public function logout(Request $request): JsonResponse
    {
        $tokenRecord = $request->attributes->get('auth_token');

        if ($tokenRecord) {
            $tokenRecord->delete();
        }

        return $this->respuestaExito(null, 'Sesión cerrada correctamente. Token revocado.');
    }

    /**
     * Obtener el perfil y roles del usuario autenticado.
     */
    public function perfil(Request $request): JsonResponse
    {
        $usuario = $request->user()->load('rol');

        return $this->respuestaExito([
            'id_usuario' => $usuario->id_usuario,
            'nombre' => $usuario->nombre,
            'usuario' => $usuario->usuario,
            'correo' => $usuario->correo,
            'rol' => $usuario->rol?->nombre,
            'descripcion_rol' => $usuario->rol?->descripcion,
            'avatar' => $usuario->avatar,
            'estado' => $usuario->estado,
            'ultimo_acceso' => $usuario->ultimo_acceso?->toIso8601String(),
        ], 'Perfil de usuario obtenido');
    }
}
