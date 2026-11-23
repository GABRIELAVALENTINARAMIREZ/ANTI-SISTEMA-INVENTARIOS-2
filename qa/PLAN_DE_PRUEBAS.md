# Plan de Aseguramiento de Calidad y Pruebas (QA) - Sprint 2
## Sistema de Gestión de Inventarios GAMA (FastStock)

**Líder de QA / Backend:** Equipo de Ingeniería GAMA  
**Entorno de Ejecución:** Windows 10/11, PHP 8.2+ (XAMPP), MySQL 8.x / MariaDB  
**Herramientas de Prueba:** PHPUnit 10.5, Invoke-RestMethod (PowerShell), Curl, Postman  

---

## 1. Objetivos del Plan de Pruebas
1. Garantizar la robustez, consistencia y seguridad de la API RESTful v1.
2. Validar que la autenticación mediante tokens Bearer y el almacenamiento de credenciales cumplan con estándares de ciberseguridad (Bcrypt, SHA-256).
3. Asegurar que las reglas de autorización por roles (RBAC) impidan de forma estricta accesos indebidos o escalamiento de privilegios.
4. Verificar la integridad de los datos en todas las operaciones CRUD y flujos transaccionales de Kardex.
5. Comprobar que los errores sean manejados de manera controlada y homogénea sin exponer datos de infraestructura (SQL Injection, stack traces).

---

## 2. Alcance de las Pruebas

### 2.1 Enfoque de Pruebas Unitarias
- Validación de métodos del modelo `User`: `tieneRol()`, `crearTokenApi()`, cifrado de tokens en base de datos.
- Validación de métodos de expiración en `PersonalAccessToken`: `haExpirado()`.

### 2.2 Enfoque de Pruebas de Integración y API (Feature Tests)
- **Autenticación (`AuthApiTest`):**
  - CP-AUTH-01: Login exitoso con emisión de token Bearer (200 OK).
  - CP-AUTH-02: Rechazo de login con contraseña incorrecta (401 Unauthorized).
  - CP-AUTH-03: Bloqueo de rutas protegidas sin cabecera Authorization (401 Unauthorized).
  - CP-AUTH-04: Acceso exitoso a perfil con token válido (200 OK).
  - CP-AUTH-05: Cierre de sesión y revocación atómica del token (200 OK y posterior 401 en reuso).
- **Control de Acceso Basado en Roles (`RbacApiTest`):**
  - CP-RBAC-01: El rol `Empleado` puede consultar productos pero recibe `403 Forbidden` al intentar crear un producto.
  - CP-RBAC-02: El rol `Encargado de inventario` puede crear productos pero recibe `403 Forbidden` al intentar eliminar un producto.
  - CP-RBAC-03: El rol `Administrador` cuenta con privilegios totales para eliminar entidades.
- **Ciclo de Vida CRUD y Validación (`ProductCrudApiTest`):**
  - CP-CRUD-01: Validación de campos requeridos y tipos de datos (422 Unprocessable Entity).
  - CP-CRUD-02: Ciclo completo CREATE (201) -> READ (200) -> UPDATE (200) -> DELETE (200) -> READ AFTER DELETE (404).
  - CP-CRUD-03: Protección de integridad referencial: rechazo de eliminación de productos con histórico de movimientos o lotes (409 Conflict).

---

## 3. Estrategia de Ejecución y Criterios de Aceptación
- **Criterio de salida:** 100% de las pruebas automatizadas en PHPUnit deben pasar sin errores ni advertencias (`OK (13 tests, 67 assertions)`).
- **Seguridad:** Ninguna consulta SQL debe presentar vulnerabilidades de inyección SQL ni filtrado de contraseñas en texto claro.
