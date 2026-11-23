# Guía Técnica de Operaciones CRUD - Sistema de Inventarios GAMA (FastStock)

Este documento detalla la especificación de las operaciones **CRUD (Create, Read, Update, Delete)** implementadas en la API RESTful v1 del proyecto para el segundo sprint.

---

## 📐 Convenciones Globales de la API

- **Formato de Comunicación:** JSON (`Content-Type: application/json`, `Accept: application/json`).
- **Autenticación:** Cabecera `Authorization: Bearer <token_acceso>`.
- **Estructura Estándar de Respuesta:**
  - **Éxito (200 / 201):**
    ```json
    {
      "exito": true,
      "mensaje": "Mensaje descriptivo de la operación",
      "datos": { ... }
    }
    ```
  - **Error (400, 401, 403, 404, 409, 422, 500):**
    ```json
    {
      "exito": false,
      "mensaje": "Descripción controlada del error",
      "errores": { ... } // Opcional, presente en 422
    }
    ```

---

## 1. Módulo: Productos (`/api/v1/productos`)

### 1.1 Listar Productos (READ - Colección)
- **Método y Ruta:** `GET /api/v1/productos`
- **Permisos:** Todos los roles autenticados (`Administrador`, `Encargado de inventario`, `Empleado`).
- **Parámetros de consulta (Query Params):**
  - `buscar`: Búsqueda textual por nombre o código del producto.
  - `id_categoria`: Filtrar por identificador de categoría.
  - `id_proveedor`: Filtrar por proveedor.
  - `id_ubicacion`: Filtrar por ubicación de almacenamiento.
  - `estado`: `disponible` (stock > mínimo), `bajo_stock` (stock <= mínimo), `agotado` (stock <= 0).
  - `por_pagina`: Número de registros por página (por defecto 20).
- **Código HTTP:** `200 OK`.

### 1.2 Obtener Producto por ID (READ - Individual)
- **Método y Ruta:** `GET /api/v1/productos/{id}`
- **Permisos:** Todos los roles autenticados.
- **Códigos HTTP:** `200 OK` si existe, `404 Not Found` si no existe.

### 1.3 Crear Producto (CREATE)
- **Método y Ruta:** `POST /api/v1/productos`
- **Permisos:** `Administrador`, `Encargado de inventario`.
- **Cuerpo de Petición (JSON):**
  ```json
  {
    "codigo": "PAN-004",
    "nombre": "Pan baguette rústico",
    "imagen": "/images/pan_baguette.jpg",
    "id_categoria": 2,
    "id_proveedor": 2,
    "id_ubicacion": 1,
    "cantidad": 50,
    "unidad_medida": "unidades",
    "stock_minimo": 20,
    "precio_compra": 1800
  }
  ```
- **Validaciones:**
  - `codigo`: Obligatorio, único en la tabla `productos`, máx 30 chars.
  - `nombre`: Obligatorio, texto máx 150 chars.
  - `id_categoria`: Obligatorio, debe existir en tabla `categorias`.
  - `id_proveedor`: Obligatorio, debe existir en tabla `proveedores`.
  - `cantidad`, `stock_minimo`, `precio_compra`: Numéricos, mayor o igual a 0.
- **Códigos HTTP:** `201 Created` en éxito, `422 Unprocessable Entity` en error de validación.

### 1.4 Actualizar Producto (UPDATE)
- **Método y Ruta:** `PUT/PATCH /api/v1/productos/{id}`
- **Permisos:** `Administrador`, `Encargado de inventario`.
- **Cuerpo de Petición (JSON):** Permite actualización total o parcial de campos. El campo `codigo` valida unicidad ignorando el ID actual.
- **Códigos HTTP:** `200 OK` en éxito, `404 Not Found`, `422 Unprocessable Entity`.

### 1.5 Eliminar Producto (DELETE)
- **Método y Ruta:** `DELETE /api/v1/productos/{id}`
- **Permisos:** Exclusivo `Administrador`.
- **Regla de Integridad Referencial:** Si el producto tiene movimientos en Kardex, recetas o lotes asociados, el sistema rechaza la eliminación con código `409 Conflict` protegiendo el historial contable.
- **Códigos HTTP:** `200 OK` si se elimina con éxito, `404 Not Found` si no existe, `409 Conflict` si tiene referencias activas.

---

## 2. Módulo: Categorías (`/api/v1/categorias`)

- **GET `/api/v1/categorias`**: Lista todas las categorías activas con conteo de productos asociados.
- **POST `/api/v1/categorias`**: Crea una nueva categoría (`nombre`, `descripcion`, `icono`, `color`).
- **PUT `/api/v1/categorias/{id}`**: Modifica una categoría existente.
- **DELETE `/api/v1/categorias/{id}`**: Elimina una categoría únicamente si no tiene productos asociados (`409 Conflict` si tiene productos).

---

## 3. Módulo: Proveedores (`/api/v1/proveedores`)

- **GET `/api/v1/proveedores`**: Lista de proveedores con filtros por estado o búsqueda por nombre/NIT.
- **POST `/api/v1/proveedores`**: Registro de nuevo proveedor con validación de formato de correo, teléfono y NIT.
- **PUT `/api/v1/proveedores/{id}`**: Actualización de datos de contacto comercial.
- **DELETE `/api/v1/proveedores/{id}`**: Eliminación segura con control referencial sobre productos suministrados.

---

## 4. Módulo: Lotes y Vencimientos (`/api/v1/lotes`)

- **GET `/api/v1/lotes`**: Consulta de lotes con filtros por estado de vencimiento (`vencido`, `proximo_a_vencer`, `vigente`).
- **POST `/api/v1/lotes`**: Registro de nuevo lote con fecha de ingreso, vencimiento y cantidad inicial.
- **PUT `/api/v1/lotes/{id}`**: Ajuste de existencias de lote o marcado de `dado_de_baja: true`.
- **DELETE `/api/v1/lotes/{id}`**: Eliminación de registros de lote erróneos por el Administrador.

---

## 5. Módulo: Recetas (`/api/v1/recetas`)

- **GET `/api/v1/recetas`**: Consulta de recetas con desglose completo de ingredientes y costeo calculado en tiempo real.
- **POST `/api/v1/recetas`**: Creación de nueva receta con sus ingredientes asociados de forma atómica.
- **PUT `/api/v1/recetas/{id}`**: Edición de nombre, categoría de menú, precio de venta y lista de insumos.
- **DELETE `/api/v1/recetas/{id}`**: Eliminación de receta protegida contra dependencias activas.

---

## 6. Módulo: Movimientos de Inventario / Kardex (`/api/v1/movimientos`)

- **GET `/api/v1/movimientos`**: Consulta cronológica con filtros por tipo (`entrada`, `salida`), fecha inicial, fecha final y usuario.
- **POST `/api/v1/movimientos`**: Registra un movimiento atómico:
  - En **entradas**, suma la cantidad al stock del producto.
  - En **salidas** o **mermas**, valida existencias suficientes y descuenta del stock.
  - Genera automáticamente un registro en la tabla de `auditoria`.
  - Si cualquier cálculo o actualización falla, se ejecuta un `ROLLBACK` completo de la base de datos.
