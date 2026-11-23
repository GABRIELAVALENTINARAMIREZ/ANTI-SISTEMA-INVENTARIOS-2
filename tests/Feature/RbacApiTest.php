<?php

namespace Tests\Feature;

use Tests\TestCase;

class RbacApiTest extends TestCase
{
    private function obtenerToken(string $usuario, string $clave): string
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'identificador' => $usuario,
            'password' => $clave,
        ]);

        return $loginResponse->json('datos.token_acceso');
    }

    /**
     * Empleado puede leer productos pero NO puede crear productos (403).
     */
    public function test_empleado_puede_leer_pero_no_crear_productos(): void
    {
        $tokenEmpleado = $this->obtenerToken('mrojas', 'Empleado123*');

        // Lectura permitida
        $readResponse = $this->withHeader('Authorization', "Bearer {$tokenEmpleado}")
            ->getJson('/api/v1/productos');

        $readResponse->assertStatus(200);

        // Creación denegada (403)
        $createResponse = $this->withHeader('Authorization', "Bearer {$tokenEmpleado}")
            ->postJson('/api/v1/productos', [
                'codigo' => 'TEST-EMP-001',
                'nombre' => 'Producto no autorizado',
                'id_categoria' => 1,
                'id_proveedor' => 1,
                'cantidad' => 10,
                'unidad_medida' => 'unidades',
                'stock_minimo' => 5,
                'precio_compra' => 1000,
            ]);

        $createResponse->assertStatus(403)
            ->assertJsonPath('exito', false);
    }

    /**
     * Encargado de inventario puede crear productos pero NO puede eliminarlos (403).
     */
    public function test_encargado_inventario_no_puede_eliminar_productos(): void
    {
        $tokenEncargado = $this->obtenerToken('jvargas', 'Inventario123*');

        // Intento de eliminación denegado (solo Administrador)
        $deleteResponse = $this->withHeader('Authorization', "Bearer {$tokenEncargado}")
            ->deleteJson('/api/v1/productos/1');

        $deleteResponse->assertStatus(403)
            ->assertJsonPath('exito', false);
    }

    /**
     * Administrador tiene acceso total para eliminar productos.
     */
    public function test_administrador_tiene_permiso_para_eliminar(): void
    {
        $tokenAdmin = $this->obtenerToken('cmendoza', 'Admin123*');

        // Crear primero un producto temporal sin movimientos
        $createResponse = $this->withHeader('Authorization', "Bearer {$tokenAdmin}")
            ->postJson('/api/v1/productos', [
                'codigo' => 'TEMP-DEL-999',
                'nombre' => 'Producto temporal para borrado',
                'id_categoria' => 1,
                'id_proveedor' => 1,
                'cantidad' => 5,
                'unidad_medida' => 'unidades',
                'stock_minimo' => 2,
                'precio_compra' => 500,
            ]);

        $id = $createResponse->json('datos.id_producto');

        // Administrador lo elimina exitosamente (200)
        $deleteResponse = $this->withHeader('Authorization', "Bearer {$tokenAdmin}")
            ->deleteJson("/api/v1/productos/{$id}");

        $deleteResponse->assertStatus(200)
            ->assertJsonPath('exito', true);
    }
}
