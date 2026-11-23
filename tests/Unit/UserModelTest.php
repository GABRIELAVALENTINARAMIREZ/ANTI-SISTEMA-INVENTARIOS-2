<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;

class UserModelTest extends TestCase
{
    /**
     * Prueba de verificación de roles del usuario.
     */
    public function test_usuario_verificacion_de_roles(): void
    {
        $admin = User::where('usuario', 'cmendoza')->first();
        $this->assertNotNull($admin);
        $this->assertTrue($admin->tieneRol('Administrador'));
        $this->assertFalse($admin->tieneRol('Empleado'));
    }

    /**
     * Prueba de generación de token seguro con hash SHA-256.
     */
    public function test_creacion_de_token_seguro(): void
    {
        $usuario = User::where('usuario', 'cmendoza')->first();
        $tokenPlano = $usuario->crearTokenApi('Token Unit Test', ['*'], 60);

        $this->assertNotEmpty($tokenPlano);
        $this->assertEquals(64, strlen($tokenPlano));

        // Verificar que en base de datos se almacena el hash, no el texto plano
        $hashEsperado = hash('sha256', $tokenPlano);
        $this->assertDatabaseHas('personal_access_tokens', [
            'id_usuario' => $usuario->id_usuario,
            'token' => $hashEsperado,
        ]);
    }
}
