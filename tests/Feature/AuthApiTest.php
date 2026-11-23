<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthApiTest extends TestCase
{
    /**
     * Prueba de inicio de sesión exitoso con credenciales válidas.
     */
    public function test_login_exitoso_genera_token_bearer(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'identificador' => 'cmendoza',
            'password' => 'Admin123*',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('exito', true)
            ->assertJsonStructure([
                'exito',
                'mensaje',
                'datos' => [
                    'token_acceso',
                    'tipo_token',
                    'expira_en_minutos',
                    'usuario' => [
                        'id_usuario',
                        'nombre',
                        'usuario',
                        'correo',
                        'rol',
                    ],
                ],
            ]);
    }

    /**
     * Prueba de intento de inicio de sesión con credenciales erróneas.
     */
    public function test_login_fallido_con_clave_invalida(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'identificador' => 'cmendoza',
            'password' => 'ClaveIncorrecta999*',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('exito', false);
    }

    /**
     * Prueba de intento de acceso a ruta protegida sin token Bearer.
     */
    public function test_acceso_denegado_sin_token(): void
    {
        $response = $this->getJson('/api/v1/auth/perfil');

        $response->assertStatus(401)
            ->assertJsonPath('exito', false);
    }

    /**
     * Prueba de consulta de perfil de usuario con token válido.
     */
    public function test_consulta_perfil_con_token_valido(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'identificador' => 'cmendoza',
            'password' => 'Admin123*',
        ]);

        $token = $loginResponse->json('datos.token_acceso');

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/perfil');

        $response->assertStatus(200)
            ->assertJsonPath('exito', true)
            ->assertJsonPath('datos.usuario', 'cmendoza')
            ->assertJsonPath('datos.rol', 'Administrador');
    }

    /**
     * Prueba de revocación de token al cerrar sesión.
     */
    public function test_logout_revoca_token_y_bloquea_reuso(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'identificador' => 'cmendoza',
            'password' => 'Admin123*',
        ]);

        $token = $loginResponse->json('datos.token_acceso');

        // Cerrar sesión
        $logoutResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout');

        $logoutResponse->assertStatus(200)
            ->assertJsonPath('exito', true);

        // Intentar usar el token revocado debe retornar 401
        $reuseResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/perfil');

        $reuseResponse->assertStatus(401)
            ->assertJsonPath('exito', false);
    }
}
