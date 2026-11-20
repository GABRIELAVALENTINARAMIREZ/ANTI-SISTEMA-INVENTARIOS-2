# Catálogo de Endpoints de la API REST v1

## 1. Convenciones y Parámetros Globales

- **URL Base**: `http://localhost:8000/api/v1`
- **Formato de intercambio**: `application/json` (UTF-8).
- **Cabeceras obligatorias para peticiones protegidas**:
  ```http
  Authorization: Bearer <TOKEN_DE_ACCESO>
  Accept: application/json
  Content-Type: application/json
  ```
- **Estructura de respuesta consistente**:
  - **Éxito (200, 201)**:
    ```json
    {
      "exito": true,
      "mensaje": "Descripción de la operación exitosa",
      "datos": { ... }
    }
    ```
  - **Error (400, 401, 403, 404, 422, 500)**:
    ```json
    {
      "exito": false,
      "mensaje": "Descripción del error",
      "errores": { "campo": ["Detalle del error"] }
    }
    ```

---

## 2. Matriz de Endpoints y Permisos por Rol

| Módulo | Método | Endpoint | Roles Autorizados | Descripción |
| :--- | :---: | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/login` | Público | Autentica credenciales y emite token Bearer. |
| **Auth** | `POST` | `/auth/logout` | Todos (Autenticado) | Revoca el token en uso. |
| **Auth** | `GET` | `/auth/perfil` | Todos (Autenticado) | Retorna información del usuario y su rol. |
| **Productos** | `GET` | `/productos` | Todos | Listado con filtros y paginación. |
| **Productos** | `GET` | `/productos/{id}` | Todos | Detalle de un producto con lotes vigentes. |
| **Productos** | `POST` | `/productos` | Administrador, Encargado | Crea un nuevo insumo/producto. |
| **Productos** | `PUT` | `/productos/{id}` | Administrador, Encargado | Actualiza un producto existente. |
| **Productos** | `DELETE`| `/productos/{id}` | **Solo Administrador** | Elimina si no tiene movimientos históricos. |
| **Categorías** | `GET` | `/categorias` | Todos | Listado de familias de insumos. |
| **Categorías** | `POST` | `/categorias` | Administrador, Encargado | Crea una categoría. |
| **Categorías** | `PUT` | `/categorias/{id}` | Administrador, Encargado | Modifica nombre, descripción o color. |
| **Categorías** | `DELETE`| `/categorias/{id}` | **Solo Administrador** | Elimina una categoría sin productos. |
| **Proveedores**| `GET` | `/proveedores` | Todos | Directorio de proveedores. |
| **Proveedores**| `POST` | `/proveedores` | Administrador, Encargado | Registra un nuevo proveedor. |
| **Proveedores**| `PUT` | `/proveedores/{id}` | Administrador, Encargado | Actualiza información de contacto o NIT. |
| **Proveedores**| `DELETE`| `/proveedores/{id}` | **Solo Administrador** | Elimina si no tiene operaciones asociadas. |
| **Movimientos**| `GET` | `/movimientos` | Todos | Historial de Kardex de entradas/salidas. |
| **Movimientos**| `GET` | `/movimientos/{id}` | Todos | Consulta el detalle atómico de un movimiento. |
| **Movimientos**| `POST` | `/movimientos` | Todos | Procesa entrada o salida con ajuste de stock. |
| **Lotes** | `GET` | `/lotes` | Todos | Trazabilidad y fechas de vencimiento. |
| **Lotes** | `POST` | `/lotes` | Administrador, Encargado | Ingresa un lote al almacén. |
| **Lotes** | `PUT` | `/lotes/{id}` | Administrador, Encargado | Actualiza cantidad o da de baja. |
| **Lotes** | `DELETE`| `/lotes/{id}` | **Solo Administrador** | Elimina registro de lote. |
| **Recetas** | `GET` | `/recetas` | Todos | Catálogo de recetas del menú con escandallo. |
| **Recetas** | `GET` | `/recetas/{id}` | Todos | Detalle de ingredientes por receta. |
| **Recetas** | `POST` | `/recetas` | Administrador, Encargado | Registra receta y sus ingredientes. |
| **Recetas** | `PUT` | `/recetas/{id}` | Administrador, Encargado | Actualiza precios y tiempos de preparación. |
| **Recetas** | `DELETE`| `/recetas/{id}` | **Solo Administrador** | Elimina receta del catálogo. |

---

## 3. Ejemplos de Petición y Respuesta

### 3.1. Autenticación (`POST /auth/login`)
**Petición:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "identificador": "cmendoza",
    "password": "Admin123*"
  }'
```
**Respuesta (200 OK):**
```json
{
  "exito": true,
  "mensaje": "Autenticación exitosa. Token generado.",
  "datos": {
    "token_acceso": "a8f9c1e7...64_caracteres_aleatorios...",
    "tipo_token": "Bearer",
    "expira_en_minutos": 480,
    "usuario": {
      "id_usuario": 1,
      "nombre": "Camila Mendoza",
      "usuario": "cmendoza",
      "correo": "camila.mendoza@gama.com.co",
      "rol": "Administrador",
      "avatar": "/images/gama_admin_avatar_1795030584617.jpg"
    }
  }
}
```

---

### 3.2. Crear Producto (`POST /productos`)
**Petición:**
```bash
curl -X POST http://localhost:8000/api/v1/productos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "codigo": "PAN-004",
    "nombre": "Pan Brioche con Ajonjolí Negro",
    "id_categoria": 2,
    "id_proveedor": 2,
    "id_ubicacion": 1,
    "cantidad": 80,
    "unidad_medida": "unidades",
    "stock_minimo": 20,
    "precio_compra": 1150
  }'
```
**Respuesta (201 Created):**
```json
{
  "exito": true,
  "mensaje": "Producto creado exitosamente",
  "datos": {
    "id_producto": 16,
    "codigo": "PAN-004",
    "nombre": "Pan Brioche con Ajonjolí Negro",
    "cantidad": "80.00",
    "unidad_medida": "unidades",
    "stock_minimo": "20.00",
    "precio_compra": "1150.00",
    "categoria": {
      "id_categoria": 2,
      "nombre": "Panes"
    }
  }
}
```

---

### 3.3. Registrar Movimiento de Salida por Receta (`POST /movimientos`)
Valida de forma transaccional que haya stock suficiente y descuenta automáticamente las existencias.
**Petición:**
```bash
curl -X POST http://localhost:8000/api/v1/movimientos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "tipo": "salida",
    "subtipo": "Venta / Receta",
    "observacion": "Preparación de 10 Hamburguesas Clásicas turno noche",
    "detalles": [
      { "id_producto": 1, "cantidad": 10, "costo_unitario": 950 },
      { "id_producto": 2, "cantidad": 10, "costo_unitario": 3800 },
      { "id_producto": 3, "cantidad": 10, "costo_unitario": 650 }
    ]
  }'
```
**Respuesta (201 Created):**
```json
{
  "exito": true,
  "mensaje": "Movimiento de inventario procesado exitosamente",
  "datos": {
    "id_movimiento": 4,
    "tipo": "salida",
    "subtipo": "Venta / Receta",
    "total_cop": "54000.00",
    "fecha": "2026-11-20T10:15:00.000000Z",
    "detalles": [ ... ]
  }
}
```
Si el stock fuera menor a 10 unidades, el endpoint retorna **`422 Unprocessable Entity`** con rollback total sin alterar ninguna tabla:
```json
{
  "exito": false,
  "mensaje": "Stock insuficiente para 'Carne de hamburguesa 150g'. Disponible: 4 porciones, Solicitado: 10"
}
```
