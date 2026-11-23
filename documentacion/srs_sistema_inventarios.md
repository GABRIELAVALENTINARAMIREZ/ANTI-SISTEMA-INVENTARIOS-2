# Especificación de Requerimientos de Software (SRS)
## Sistema de Gestión de Inventarios GAMA (FastStock) - Sprint 2

**Estándar de referencia:** IEEE Std 830-1998  
**Fecha:** Noviembre 2026  
**Versión:** 2.0.0 (Segundo Sprint)  
**Estado:** Aprobado para Revisión  

---

## 1. Introducción

### 1.1 Propósito
El presente documento describe la especificación formal de requerimientos para el **Sistema de Gestión de Inventarios GAMA (FastStock)** en su segundo sprint. El objetivo central de esta fase es consolidar la capa de persistencia bajo rigurosos estándares de seguridad, implementar una API RESTful completa con autenticación por tokens y control de acceso basado en roles (RBAC), implementar los flujos CRUD de los módulos centrales del restaurante y proveer documentación exhaustiva para desarrolladores e instructores.

### 1.2 Alcance del Sistema
El sistema proporciona una plataforma integral para el control de inventarios de locales de comidas rápidas y restaurantes, incluyendo:
- Control de materias primas, insumos y productos terminados con niveles de stock mínimo y alertas automáticas.
- Registro transaccional de movimientos en Kardex (entradas por compra, salidas por venta o preparación de recetas, y mermas/desperdicios).
- Gestión de lotes de insumos perecederos con fechas de ingreso y vencimiento para trazabilidad bromatológica.
- Mapeo de recetas estándar con deducción atómica de ingredientes del stock.
- Exposición de una API REST v1 para consumo por clientes web, móviles y sistemas de punto de venta (POS).

### 1.3 Definiciones, Acrónimos y Abreviaturas
- **API (Application Programming Interface):** Interfaz de programación para comunicación cliente-servidor mediante HTTP y JSON.
- **RBAC (Role-Based Access Control):** Control de acceso basado en roles (`Administrador`, `Encargado de inventario`, `Empleado`).
- **ORM (Object-Relational Mapping):** Mapeo objeto-relacional provisto por Eloquent para evitar concatenación de consultas SQL.
- **Kardex:** Registro cronológico y estructurado de todas las entradas y salidas de existencias.
- **Principio de Mínimo Privilegio:** Asignación exclusiva de los permisos mínimos indispensables para la operación de usuarios y servicios en la base de datos.
- **Bearer Token:** Esquema de autenticación HTTP donde el cliente presenta un token criptográfico generado tras el login.

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
El sistema opera en una arquitectura cliente-servidor de 3 capas:
1. **Capa de Presentación:** Interfaz web responsiva con Bootstrap 5.3 y clientes API externos.
2. **Capa Lógica / Negocio:** Framework PHP Laravel 10+, controladores RESTful, middleware de seguridad, políticas de rol y validadores de formulario.
3. **Capa de Datos:** Motor relacional MySQL 8.x / MariaDB (XAMPP), versionado con migraciones de Laravel y changelogs de Liquibase.

### 2.2 Roles y Perfiles de Usuario
1. **Administrador (`id_rol = 1`):** Acceso total a la configuración del sistema, gestión de usuarios, catálogos, auditoría y operaciones destructivas (eliminación de registros).
2. **Encargado de inventario (`id_rol = 2`):** Gestión de compras, registro de entradas, actualización de productos, lotes y proveedores. No tiene permisos de eliminación de entidades.
3. **Empleado (`id_rol = 3`):** Consulta de inventario, consulta de recetas y registro de consumo operativo. No puede modificar catálogo ni eliminar registros.

---

## 3. Requerimientos Específicos

### 3.1 Requerimientos Funcionales (RF)

| Código | Módulo | Descripción | Criterio de Aceptación |
| :--- | :--- | :--- | :--- |
| **RF-01** | Autenticación | Inicio de sesión seguro mediante identificador (usuario o correo) y contraseña. | Retorna token Bearer de 64 caracteres criptográficamente aleatorio con hash SHA-256 en BD y expiración a las 8 horas. |
| **RF-02** | Autenticación | Cierre de sesión y revocación del token en uso. | Elimina el token de la base de datos; peticiones posteriores con dicho token reciben `401 Unauthorized`. |
| **RF-03** | Perfil | Consulta de información y permisos del usuario conectado. | Retorna datos del usuario autenticado sin exponer el hash de la contraseña. |
| **RF-04** | Productos (CRUD) | Crear, consultar, listar, filtrar, editar y eliminar productos del inventario. | Valida código único, categorías y proveedores existentes, valores numéricos no negativos. Protege contra eliminación si existen relaciones activas (`409 Conflict`). |
| **RF-05** | Categorías (CRUD) | Gestión de categorías para clasificar insumos (carnes, panes, salsas, etc.). | Listado estructurado y CRUD restringido a administradores y encargados. |
| **RF-06** | Proveedores (CRUD) | Gestión del directorio de proveedores con NIT, contacto y catálogo de productos suministrados. | Validación de campos de contacto y estado activo/inactivo. |
| **RF-07** | Lotes (CRUD) | Registro y seguimiento de lotes con fechas de ingreso y vencimiento. | Permite control FIFO/FEFO y marcado de baja por vencimiento. |
| **RF-08** | Recetas (CRUD) | Definición de recetas estándar con lista de ingredientes y cantidades requeridas. | Permite costeo automático de recetas y cálculo de margen de ganancia. |
| **RF-09** | Movimientos (Kardex) | Registro de entradas, salidas y mermas con actualización atómica de existencias. | Ejecutado bajo transacción de base de datos (`DB::transaction`). Si una operación falla, se revierte por completo. |
| **RF-10** | RBAC | Verificación de permisos por rol en cada endpoint mediante middleware. | Peticiones de usuarios sin privilegios suficientes reciben `403 Forbidden` con mensaje descriptivo sin filtrar datos internos. |

### 3.2 Requerimientos No Funcionales (RNF)

| Código | Categoría | Especificación |
| :--- | :--- | :--- |
| **RNF-01** | Seguridad en BD | Principio de mínimo privilegio: usuarios dedicados `app_inventario` (solo DML: SELECT, INSERT, UPDATE, DELETE) y `admin_inventario` (DDL para migraciones). |
| **RNF-02** | Seguridad en Código | Prohibición absoluta de credenciales o secretos "hardcoded" en el repositorio. Uso estricto de `.env` y `.env.example`. |
| **RNF-03** | Prevención SQLi | Blindaje del 100% de las consultas a base de datos mediante el ORM Eloquent y declaraciones preparadas (PDO parameterized queries). |
| **RNF-04** | Almacenamiento Criptográfico | Contraseñas protegidas con algoritmo **Bcrypt** con factor de coste balanceado. Tokens de sesión almacenados como hash **SHA-256**. |
| **RNF-05** | Formato de Respuestas | Respuestas RESTful homogéneas en JSON estructuradas con llaves estándar: `exito` (boolean), `mensaje` (string), `datos` (object/array o null) y `errores` (en caso de validación fallida 422). |
| **RNF-06** | Códigos de Estado HTTP | Uso semántico correcto: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `500 Internal Server Error`. |
| **RNF-07** | Ocultamiento de Trazas | Modo de depuración deshabilitable (`APP_DEBUG=false` en prod) y manejo de excepciones mediante `BaseApiController` para no exponer stack traces ni rutas de archivos del servidor. |
| **RNF-08** | Rendimiento y Tasa | Rate Limiter configurado en `RouteServiceProvider` a 60 peticiones por minuto por usuario o IP para prevenir ataques de fuerza bruta y denegación de servicio. |

---

## 4. Matriz de Trazabilidad de Requerimientos

| Requerimiento | Endpoint / Componente | Middleware | Estado Sprint 2 |
| :--- | :--- | :--- | :--- |
| RF-01 | `POST /api/v1/auth/login` | Público / Throttle | Implementado y Probado |
| RF-02 | `POST /api/v1/auth/logout` | `auth.api` | Implementado y Probado |
| RF-03 | `GET /api/v1/auth/perfil` | `auth.api` | Implementado y Probado |
| RF-04 (Lectura) | `GET /api/v1/productos` | `auth.api` | Implementado y Probado |
| RF-04 (Crear/Editar) | `POST, PUT /api/v1/productos` | `role:Admin,Encargado` | Implementado y Probado |
| RF-04 (Eliminar) | `DELETE /api/v1/productos/{id}` | `role:Admin` | Implementado y Probado |
| RF-05 (CRUD) | `/api/v1/categorias` | `role:Admin,Encargado` | Implementado y Probado |
| RF-06 (CRUD) | `/api/v1/proveedores` | `role:Admin,Encargado` | Implementado y Probado |
| RF-07 (CRUD) | `/api/v1/lotes` | `role:Admin,Encargado` | Implementado y Probado |
| RF-08 (CRUD) | `/api/v1/recetas` | `role:Admin,Encargado` | Implementado y Probado |
| RF-09 (Kardex) | `/api/v1/movimientos` | `auth.api` | Implementado y Probado |
| RF-10 (RBAC) | `EnsureRole.php` | `role:*` | Implementado y Probado |
