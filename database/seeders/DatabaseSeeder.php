<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        DB::table('roles')->insertOrIgnore([
            ['id_rol' => 1, 'nombre' => 'Administrador', 'descripcion' => 'Control total del sistema y configuración'],
            ['id_rol' => 2, 'nombre' => 'Encargado de inventario', 'descripcion' => 'Gestión de entradas, salidas, mermas y lotes'],
            ['id_rol' => 3, 'nombre' => 'Empleado', 'descripcion' => 'Consulta de recetas y registro de consumo operativo'],
        ]);

        // 2. Usuarios
        DB::table('usuarios')->insertOrIgnore([
            [
                'id_usuario' => 1,
                'id_rol' => 1,
                'nombre' => 'Camila Mendoza',
                'usuario' => 'cmendoza',
                'correo' => 'camila.mendoza@gama.com.co',
                'password_hash' => Hash::make('Admin123*'),
                'avatar' => '/images/gama_admin_avatar_1795030584617.jpg',
                'estado' => 'Activo',
                'ultimo_acceso' => '2026-11-18 11:30:00',
            ],
            [
                'id_usuario' => 2,
                'id_rol' => 2,
                'nombre' => 'Julián Vargas',
                'usuario' => 'jvargas',
                'correo' => 'julian.vargas@gama.com.co',
                'password_hash' => Hash::make('Inventario123*'),
                'avatar' => null,
                'estado' => 'Activo',
                'ultimo_acceso' => '2026-11-18 09:45:00',
            ],
            [
                'id_usuario' => 3,
                'id_rol' => 3,
                'nombre' => 'Mateo Rojas',
                'usuario' => 'mrojas',
                'correo' => 'mateo.rojas@gama.com.co',
                'password_hash' => Hash::make('Empleado123*'),
                'avatar' => null,
                'estado' => 'Activo',
                'ultimo_acceso' => '2026-11-18 11:12:00',
            ],
            [
                'id_usuario' => 4,
                'id_rol' => 3,
                'nombre' => 'Sofía Castro',
                'usuario' => 'scastro',
                'correo' => 'sofia.castro@gama.com.co',
                'password_hash' => Hash::make('Empleado123*'),
                'avatar' => null,
                'estado' => 'Inactivo',
                'ultimo_acceso' => '2026-11-10 18:20:00',
            ],
        ]);

        // 3. Categorías
        DB::table('categorias')->insertOrIgnore([
            ['id_categoria' => 1, 'nombre' => 'Carnes y proteínas', 'descripcion' => 'Cortes molidos, salchichas tipo americana y alitas marinadas.', 'icono' => 'bi-fire', 'color' => '#E63946'],
            ['id_categoria' => 2, 'nombre' => 'Panes', 'descripcion' => 'Panes brioche, panes de perro caliente y masas artesanales.', 'icono' => 'bi-egg-fried', 'color' => '#FF6B35'],
            ['id_categoria' => 3, 'nombre' => 'Verduras', 'descripcion' => 'Vegetales frescos diarios: lechuga batavia, tomate chonto y cebolla.', 'icono' => 'bi-tree', 'color' => '#16A34A'],
            ['id_categoria' => 4, 'nombre' => 'Salsas', 'descripcion' => 'Aderezos base, ketchup, mayonesa, tártara y BBQ ahumada.', 'icono' => 'bi-droplet-half', 'color' => '#FFBE0B'],
            ['id_categoria' => 5, 'nombre' => 'Bebidas', 'descripcion' => 'Gaseosas en lata, botellas PET 400ml y aguas saborizadas.', 'icono' => 'bi-cup-straw', 'color' => '#2563EB'],
            ['id_categoria' => 6, 'nombre' => 'Congelados', 'descripcion' => 'Papas a la francesa corte delgado, aros de cebolla y nuggets.', 'icono' => 'bi-snow', 'color' => '#0891B2'],
            ['id_categoria' => 7, 'nombre' => 'Empaques', 'descripcion' => 'Cajas kraft para hamburguesa, portaperros, servilletas y bolsas.', 'icono' => 'bi-box-seam', 'color' => '#7C3AED'],
            ['id_categoria' => 8, 'nombre' => 'Otros ingredientes', 'descripcion' => 'Aceites vegetales para freidora, quesos tajados y condimentos.', 'icono' => 'bi-basket', 'color' => '#D97706'],
        ]);

        // 4. Proveedores
        DB::table('proveedores')->insertOrIgnore([
            [
                'id_proveedor' => 1,
                'nombre' => 'Frigorífico La Pradera S.A.S.',
                'nit' => '900.412.839-4',
                'telefono' => '+57 310 482 1920',
                'correo' => 'ventas@lapradera.com.co',
                'direccion' => 'Calle 45 # 28-14, Zona Industrial, Bogotá',
                'productos_suministrados' => json_encode(['Carne de hamburguesa', 'Salchichas', 'Alitas de pollo']),
                'estado' => 'Activo',
            ],
            [
                'id_proveedor' => 2,
                'nombre' => 'Panadería Artesanal El Trigo',
                'nit' => '830.119.502-1',
                'telefono' => '+57 315 790 3311',
                'correo' => 'pedidos@panaderiaeltrigo.co',
                'direccion' => 'Carrera 19 # 63-40, Chapinero, Bogotá',
                'productos_suministrados' => json_encode(['Pan de hamburguesa', 'Pan de perro caliente', 'Masa de pizza']),
                'estado' => 'Activo',
            ],
            [
                'id_proveedor' => 3,
                'nombre' => 'Distribuidora Lácteos y Salsas del Valle',
                'nit' => '901.204.778-9',
                'telefono' => '+57 320 651 8842',
                'correo' => 'comercial@lacteosdelvalle.co',
                'direccion' => 'Av. Américas # 50-12, Bogotá',
                'productos_suministrados' => json_encode(['Queso cheddar', 'Salsa de tomate', 'Mayonesa', 'Aceite vegetal']),
                'estado' => 'Activo',
            ],
            [
                'id_proveedor' => 4,
                'nombre' => 'Fruver Mercado Central Express',
                'nit' => '800.984.112-6',
                'telefono' => '+57 311 234 9087',
                'correo' => 'entregas@fruvercentral.com',
                'direccion' => 'Corabastos Bodega 14 Local 8, Bogotá',
                'productos_suministrados' => json_encode(['Lechuga batavia', 'Tomate chonto']),
                'estado' => 'Activo',
            ],
            [
                'id_proveedor' => 5,
                'nombre' => 'Congelados & Bebidas Andina S.A.',
                'nit' => '900.778.320-2',
                'telefono' => '+57 318 409 7710',
                'correo' => 'logistica@congeladosandina.co',
                'direccion' => 'Autopista Sur Km 4, Soacha',
                'productos_suministrados' => json_encode(['Papas congeladas', 'Gaseosas 400ml']),
                'estado' => 'Activo',
            ],
            [
                'id_proveedor' => 6,
                'nombre' => 'EcoEmpaques Colombia S.A.S.',
                'nit' => '901.558.901-0',
                'telefono' => '+57 301 992 1455',
                'correo' => 'cotizaciones@ecoempaques.co',
                'direccion' => 'Calle 17 # 68-90, Montevideo, Bogotá',
                'productos_suministrados' => json_encode(['Cajas para hamburguesas', 'Servilletas y portaperros']),
                'estado' => 'Activo',
            ],
        ]);

        // 5. Ubicaciones
        DB::table('ubicaciones')->insertOrIgnore([
            ['id_ubicacion' => 1, 'nombre' => 'Estantería A-1 (Panes)', 'tipo' => 'Ambiente'],
            ['id_ubicacion' => 2, 'nombre' => 'Cámara Fría 1 (Carnes)', 'tipo' => 'Refrigerado'],
            ['id_ubicacion' => 3, 'nombre' => 'Refrigerador Lácteos', 'tipo' => 'Refrigerado'],
            ['id_ubicacion' => 4, 'nombre' => 'Cava Verduras', 'tipo' => 'Refrigerado'],
            ['id_ubicacion' => 5, 'nombre' => 'Congelador Central', 'tipo' => 'Congelado'],
            ['id_ubicacion' => 6, 'nombre' => 'Despensa Seca B (Salsas y Aceites)', 'tipo' => 'Ambiente'],
            ['id_ubicacion' => 7, 'nombre' => 'Bodega Empaques', 'tipo' => 'Ambiente'],
            ['id_ubicacion' => 8, 'nombre' => 'Exhibidor Bebidas', 'tipo' => 'Refrigerado'],
        ]);

        // 6. Productos
        DB::table('productos')->insertOrIgnore([
            ['id_producto' => 1, 'codigo' => 'PAN-001', 'nombre' => 'Pan de hamburguesa brioche', 'imagen' => '/images/gama_ing_panes_queso_1795030585649.jpg', 'id_categoria' => 2, 'id_proveedor' => 2, 'id_ubicacion' => 1, 'cantidad' => 140, 'unidad_medida' => 'unidades', 'stock_minimo' => 50, 'precio_compra' => 950],
            ['id_producto' => 2, 'codigo' => 'CAR-001', 'nombre' => 'Carne de hamburguesa 150g', 'imagen' => '/images/gama_ing_proteinas_1795030584702.jpg', 'id_categoria' => 1, 'id_proveedor' => 1, 'id_ubicacion' => 2, 'cantidad' => 96, 'unidad_medida' => 'porciones', 'stock_minimo' => 40, 'precio_compra' => 3800],
            ['id_producto' => 3, 'codigo' => 'QUE-001', 'nombre' => 'Queso cheddar tajado', 'imagen' => '/images/gama_ing_panes_queso_1795030585649.jpg', 'id_categoria' => 8, 'id_proveedor' => 3, 'id_ubicacion' => 3, 'cantidad' => 28, 'unidad_medida' => 'tajadas', 'stock_minimo' => 45, 'precio_compra' => 650],
            ['id_producto' => 4, 'codigo' => 'VER-001', 'nombre' => 'Lechuga batavia fresca', 'imagen' => '/images/gama_ing_acompanamientos_1795030585961.jpg', 'id_categoria' => 3, 'id_proveedor' => 4, 'id_ubicacion' => 4, 'cantidad' => 42, 'unidad_medida' => 'porciones', 'stock_minimo' => 25, 'precio_compra' => 400],
            ['id_producto' => 5, 'codigo' => 'VER-002', 'nombre' => 'Tomate chonto en rodajas', 'imagen' => '/images/gama_ing_acompanamientos_1795030585961.jpg', 'id_categoria' => 3, 'id_proveedor' => 4, 'id_ubicacion' => 4, 'cantidad' => 64, 'unidad_medida' => 'rodajas', 'stock_minimo' => 40, 'precio_compra' => 220],
            ['id_producto' => 6, 'codigo' => 'CAR-002', 'nombre' => 'Salchichas tipo americana', 'imagen' => '/images/gama_ing_proteinas_1795030584702.jpg', 'id_categoria' => 1, 'id_proveedor' => 1, 'id_ubicacion' => 2, 'cantidad' => 75, 'unidad_medida' => 'unidades', 'stock_minimo' => 30, 'precio_compra' => 1650],
            ['id_producto' => 7, 'codigo' => 'PAN-002', 'nombre' => 'Pan de perro caliente', 'imagen' => '/images/gama_ing_panes_queso_1795030585649.jpg', 'id_categoria' => 2, 'id_proveedor' => 2, 'id_ubicacion' => 1, 'cantidad' => 18, 'unidad_medida' => 'unidades', 'stock_minimo' => 35, 'precio_compra' => 820],
            ['id_producto' => 8, 'codigo' => 'CON-001', 'nombre' => 'Papas congeladas corte fino', 'imagen' => '/images/gama_ing_acompanamientos_1795030585961.jpg', 'id_categoria' => 6, 'id_proveedor' => 5, 'id_ubicacion' => 5, 'cantidad' => 48, 'unidad_medida' => 'kg', 'stock_minimo' => 20, 'precio_compra' => 8900],
            ['id_producto' => 9, 'codigo' => 'OTR-001', 'nombre' => 'Aceite vegetal para freidora', 'imagen' => '/images/gama_ing_acompanamientos_1795030585961.jpg', 'id_categoria' => 8, 'id_proveedor' => 3, 'id_ubicacion' => 6, 'cantidad' => 16, 'unidad_medida' => 'litros', 'stock_minimo' => 12, 'precio_compra' => 9400],
            ['id_producto' => 10, 'codigo' => 'SAL-001', 'nombre' => 'Salsa de tomate ketchup', 'imagen' => '/images/gama_ing_acompanamientos_1795030585961.jpg', 'id_categoria' => 4, 'id_proveedor' => 3, 'id_ubicacion' => 6, 'cantidad' => 85, 'unidad_medida' => 'porciones', 'stock_minimo' => 40, 'precio_compra' => 310],
            ['id_producto' => 11, 'codigo' => 'SAL-002', 'nombre' => 'Mayonesa cremosa', 'imagen' => '/images/gama_ing_acompanamientos_1795030585961.jpg', 'id_categoria' => 4, 'id_proveedor' => 3, 'id_ubicacion' => 6, 'cantidad' => 0, 'unidad_medida' => 'porciones', 'stock_minimo' => 30, 'precio_compra' => 340],
            ['id_producto' => 12, 'codigo' => 'BEB-001', 'nombre' => 'Gaseosas 400ml surtidas', 'imagen' => '/images/gama_ing_acompanamientos_1795030585961.jpg', 'id_categoria' => 5, 'id_proveedor' => 5, 'id_ubicacion' => 8, 'cantidad' => 112, 'unidad_medida' => 'botellas', 'stock_minimo' => 48, 'precio_compra' => 2100],
            ['id_producto' => 13, 'codigo' => 'EMP-001', 'nombre' => 'Cajas para hamburguesas kraft', 'imagen' => '/images/gama_ing_acompanamientos_1795030585961.jpg', 'id_categoria' => 7, 'id_proveedor' => 6, 'id_ubicacion' => 7, 'cantidad' => 210, 'unidad_medida' => 'unidades', 'stock_minimo' => 80, 'precio_compra' => 480],
            ['id_producto' => 14, 'codigo' => 'CAR-003', 'nombre' => 'Alitas de pollo marinadas', 'imagen' => '/images/gama_ing_proteinas_1795030584702.jpg', 'id_categoria' => 1, 'id_proveedor' => 1, 'id_ubicacion' => 5, 'cantidad' => 12, 'unidad_medida' => 'porciones', 'stock_minimo' => 25, 'precio_compra' => 5400],
            ['id_producto' => 15, 'codigo' => 'PAN-003', 'nombre' => 'Masa para pizza personal', 'imagen' => '/images/gama_ing_panes_queso_1795030585649.jpg', 'id_categoria' => 2, 'id_proveedor' => 2, 'id_ubicacion' => 3, 'cantidad' => 34, 'unidad_medida' => 'unidades', 'stock_minimo' => 15, 'precio_compra' => 2300],
        ]);

        // 7. Lotes
        DB::table('lotes')->insertOrIgnore([
            ['id_lote' => 1, 'numero_lote' => 'LOT-2026-041', 'id_producto' => 2, 'cantidad' => 96, 'fecha_ingreso' => '2026-11-12', 'fecha_vencimiento' => '2026-11-22', 'id_ubicacion' => 2, 'dado_de_baja' => false],
            ['id_lote' => 2, 'numero_lote' => 'LOT-2026-042', 'id_producto' => 3, 'cantidad' => 28, 'fecha_ingreso' => '2026-11-10', 'fecha_vencimiento' => '2026-11-20', 'id_ubicacion' => 3, 'dado_de_baja' => false],
            ['id_lote' => 3, 'numero_lote' => 'LOT-2026-039', 'id_producto' => 4, 'cantidad' => 42, 'fecha_ingreso' => '2026-11-14', 'fecha_vencimiento' => '2026-11-17', 'id_ubicacion' => 4, 'dado_de_baja' => false],
            ['id_lote' => 4, 'numero_lote' => 'LOT-2026-044', 'id_producto' => 1, 'cantidad' => 140, 'fecha_ingreso' => '2026-11-17', 'fecha_vencimiento' => '2026-11-24', 'id_ubicacion' => 1, 'dado_de_baja' => false],
            ['id_lote' => 5, 'numero_lote' => 'LOT-2026-045', 'id_producto' => 8, 'cantidad' => 48, 'fecha_ingreso' => '2026-11-05', 'fecha_vencimiento' => '2027-02-15', 'id_ubicacion' => 5, 'dado_de_baja' => false],
            ['id_lote' => 6, 'numero_lote' => 'LOT-2026-046', 'id_producto' => 12, 'cantidad' => 112, 'fecha_ingreso' => '2026-11-01', 'fecha_vencimiento' => '2027-04-30', 'id_ubicacion' => 8, 'dado_de_baja' => false],
            ['id_lote' => 7, 'numero_lote' => 'LOT-2026-040', 'id_producto' => 14, 'cantidad' => 12, 'fecha_ingreso' => '2026-11-11', 'fecha_vencimiento' => '2026-11-21', 'id_ubicacion' => 5, 'dado_de_baja' => false],
        ]);

        // 8. Recetas y Detalles
        DB::table('recetas')->insertOrIgnore([
            ['id_receta' => 1, 'nombre' => 'Hamburguesa clásica', 'categoria_menu' => 'Hamburguesas', 'precio_venta' => 18900, 'tiempo_preparacion_min' => 8],
            ['id_receta' => 2, 'nombre' => 'Hamburguesa doble', 'categoria_menu' => 'Hamburguesas', 'precio_venta' => 25900, 'tiempo_preparacion_min' => 11],
            ['id_receta' => 3, 'nombre' => 'Perro caliente', 'categoria_menu' => 'Perros calientes', 'precio_venta' => 14500, 'tiempo_preparacion_min' => 6],
            ['id_receta' => 4, 'nombre' => 'Salchipapa', 'categoria_menu' => 'Salchipapas', 'precio_venta' => 16900, 'tiempo_preparacion_min' => 9],
        ]);

        DB::table('detalle_recetas')->insertOrIgnore([
            ['id_detalle_receta' => 1, 'id_receta' => 1, 'id_producto' => 1, 'cantidad' => 1],
            ['id_detalle_receta' => 2, 'id_receta' => 1, 'id_producto' => 2, 'cantidad' => 1],
            ['id_detalle_receta' => 3, 'id_receta' => 1, 'id_producto' => 3, 'cantidad' => 1],
            ['id_detalle_receta' => 4, 'id_receta' => 1, 'id_producto' => 5, 'cantidad' => 2],
            ['id_detalle_receta' => 5, 'id_receta' => 1, 'id_producto' => 4, 'cantidad' => 1],
            ['id_detalle_receta' => 6, 'id_receta' => 1, 'id_producto' => 10, 'cantidad' => 1],
            ['id_detalle_receta' => 7, 'id_receta' => 1, 'id_producto' => 13, 'cantidad' => 1],

            ['id_detalle_receta' => 8, 'id_receta' => 2, 'id_producto' => 1, 'cantidad' => 1],
            ['id_detalle_receta' => 9, 'id_receta' => 2, 'id_producto' => 2, 'cantidad' => 2],
            ['id_detalle_receta' => 10, 'id_receta' => 2, 'id_producto' => 3, 'cantidad' => 2],
            ['id_detalle_receta' => 11, 'id_receta' => 2, 'id_producto' => 10, 'cantidad' => 1],
            ['id_detalle_receta' => 12, 'id_receta' => 2, 'id_producto' => 13, 'cantidad' => 1],

            ['id_detalle_receta' => 13, 'id_receta' => 3, 'id_producto' => 7, 'cantidad' => 1],
            ['id_detalle_receta' => 14, 'id_receta' => 3, 'id_producto' => 6, 'cantidad' => 1],
            ['id_detalle_receta' => 15, 'id_receta' => 3, 'id_producto' => 3, 'cantidad' => 1],
            ['id_detalle_receta' => 16, 'id_receta' => 3, 'id_producto' => 10, 'cantidad' => 1],

            ['id_detalle_receta' => 17, 'id_receta' => 4, 'id_producto' => 8, 'cantidad' => 0.35],
            ['id_detalle_receta' => 18, 'id_receta' => 4, 'id_producto' => 6, 'cantidad' => 2],
            ['id_detalle_receta' => 19, 'id_receta' => 4, 'id_producto' => 3, 'cantidad' => 1],
            ['id_detalle_receta' => 20, 'id_receta' => 4, 'id_producto' => 10, 'cantidad' => 2],
        ]);

        // 9. Movimientos
        DB::table('movimientos')->insertOrIgnore([
            [
                'id_movimiento' => 1,
                'tipo' => 'entrada',
                'subtipo' => 'Compra a proveedor',
                'id_proveedor' => 2,
                'id_usuario' => 1,
                'observacion' => 'Reposición matutina panadería',
                'total_cop' => 133000,
                'fecha' => '2026-11-18 10:40:00',
            ],
            [
                'id_movimiento' => 2,
                'tipo' => 'salida',
                'subtipo' => 'Venta / Receta',
                'id_proveedor' => null,
                'id_usuario' => 3,
                'observacion' => 'Preparación de 12 Hamburguesas clásicas turno almuerzo',
                'total_cop' => 78240,
                'fecha' => '2026-11-18 11:15:00',
            ],
            [
                'id_movimiento' => 3,
                'tipo' => 'salida',
                'subtipo' => 'Pérdida / Desperdicio',
                'id_proveedor' => null,
                'id_usuario' => 2,
                'observacion' => 'Merma por cadena de frío en alitas marinadas',
                'total_cop' => 32400,
                'fecha' => '2026-11-17 19:20:00',
            ],
        ]);

        DB::table('detalle_movimientos')->insertOrIgnore([
            ['id_detalle' => 1, 'id_movimiento' => 1, 'id_producto' => 1, 'cantidad' => 140, 'costo_unitario' => 950],
            ['id_detalle' => 2, 'id_movimiento' => 2, 'id_producto' => 1, 'cantidad' => 12, 'costo_unitario' => 950],
            ['id_detalle' => 3, 'id_movimiento' => 2, 'id_producto' => 2, 'cantidad' => 12, 'costo_unitario' => 3800],
            ['id_detalle' => 4, 'id_movimiento' => 2, 'id_producto' => 3, 'cantidad' => 12, 'costo_unitario' => 650],
            ['id_detalle' => 5, 'id_movimiento' => 3, 'id_producto' => 14, 'cantidad' => 6, 'costo_unitario' => 5400],
        ]);

        // 10. Auditoría
        DB::table('auditoria')->insertOrIgnore([
            ['id_auditoria' => 1, 'id_usuario' => 3, 'accion' => 'EJECUTAR_RECETA', 'modulo' => 'Recetas', 'detalle' => 'Descuento automático por preparación de 12x Hamburguesa clásica', 'fecha' => '2026-11-18 11:15:00'],
            ['id_auditoria' => 2, 'id_usuario' => 1, 'accion' => 'REGISTRAR_ENTRADA', 'modulo' => 'Movimientos', 'detalle' => 'Ingreso de 140 unidades de Pan de hamburguesa brioche (Prov: El Trigo)', 'fecha' => '2026-11-18 10:40:00'],
            ['id_auditoria' => 3, 'id_usuario' => 2, 'accion' => 'REGISTRAR_MERMA', 'modulo' => 'Movimientos', 'detalle' => 'Pérdida registrada: 6 porciones de Alitas de pollo marinadas', 'fecha' => '2026-11-17 19:20:00'],
        ]);
    }
}
