<?php

namespace Tests\Feature;

use Tests\TestCase;

class ProductCrudApiTest extends TestCase
{
    private function obtenerTokenAdmin(): string
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'identificador' => 'cmendoza',
            'password' => 'Admin123*',
        ]);

        return $loginResponse->json('datos.token_acceso');
    }

    /**
     * Prueba de validación de campos requeridos al crear un producto.
     */
    public function test_validacion_campos_requeridos(): void
    {
        $token = $this->obtenerTokenAdmin();

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/productos', []);

        $response->assertStatus(422)
            ->assertJsonPath('exito', false)
            ->assertJsonStructure([
                'exito',
                'mensaje',
                'errores' => ['codigo', 'nombre', 'id_categoria', 'id_proveedor', 'cantidad', 'unidad_medida', 'stock_minimo', 'precio_compra'],
            ]);
    }

    /**
     * Prueba del ciclo CRUD completo para Productos.
     */
    public function test_ciclo_crud_completo_producto(): void
    {
        $token = $this->obtenerTokenAdmin();

        // 1. CREATE
        $codigoUnico = 'TEST-CRUD-' . uniqid();
        $createResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/productos', [
                'codigo' => $codigoUnico,
                'nombre' => 'Papas Rústicas Especiadas',
                'id_categoria' => 6,
                'id_proveedor' => 5,
                'cantidad' => 25,
                'unidad_medida' => 'kg',
                'stock_minimo' => 10,
                'precio_compra' => 4500,
            ]);

        $createResponse->assertStatus(201)
            ->assertJsonPath('exito', true)
            ->assertJsonPath('datos.codigo', $codigoUnico);

        $id = $createResponse->json('datos.id_producto');

        // 2. READ (SHOW)
        $showResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/v1/productos/{$id}");

        $showResponse->assertStatus(200)
            ->assertJsonPath('exito', true)
            ->assertJsonPath('datos.nombre', 'Papas Rústicas Especiadas');

        // 3. UPDATE
        $updateResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/v1/productos/{$id}", [
                'nombre' => 'Papas Rústicas BBQ',
                'precio_compra' => 5200,
            ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('exito', true)
            ->assertJsonPath('datos.nombre', 'Papas Rústicas BBQ')
            ->assertJsonPath('datos.precio_compra', '5200.00');

        // 4. DELETE
        $deleteResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/v1/productos/{$id}");

        $deleteResponse->assertStatus(200)
            ->assertJsonPath('exito', true);

        // 5. READ AFTER DELETE (Debe retornar 404)
        $afterDeleteResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson("/api/v1/productos/{$id}");

        $afterDeleteResponse->assertStatus(404);
    }

    /**
     * Prueba de protección contra eliminación de producto con relaciones activas (409 Conflict).
     */
    public function test_proteccion_integridad_referencial_al_eliminar(): void
    {
        $token = $this->obtenerTokenAdmin();

        // El producto 1 tiene movimientos y recetas asociadas en el Seeder
        $deleteResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson('/api/v1/productos/1');

        $deleteResponse->assertStatus(409)
            ->assertJsonPath('exito', false);
    }
}
