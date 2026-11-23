# Checklist de Control de Calidad (QA) - Sprint 2
## Sistema de Gestión de Inventarios GAMA (FastStock)

| Ítem | Categoría | Criterio de Verificación | Estado | Evidencia |
| :---: | :--- | :--- | :---: | :--- |
| **01** | **Base de Datos** | Credenciales de base de datos fuera del código fuente (`.env` versionado con `.env.example`). | **APROBADO** | Verificado en `.env.example` y `.env`. No hay claves en el repositorio. |
| **02** | **Base de Datos** | Principio de mínimo privilegio implementado para usuarios de base de datos. | **APROBADO** | Script `database/security/setup_db_user_least_privilege.sql` ejecutado con éxito en MySQL. Usuario `app_inventario` restringido a DML. |
| **03** | **Seguridad** | Consultas blindadas contra Inyección SQL (SQLi). | **APROBADO** | 100% de consultas construidas con Eloquent ORM y Query Builder parametrizado. |
| **04** | **Seguridad** | Almacenamiento seguro de contraseñas con algoritmo de derivación de claves. | **APROBADO** | Uso de `Hash::make()` (Bcrypt). Ninguna contraseña se guarda en texto plano. |
| **05** | **Autenticación** | Autenticación con Tokens Bearer de 64 caracteres criptográficamente seguros. | **APROBADO** | Verificado en `AuthController::login` y `User::crearTokenApi()`. Hash SHA-256 en BD. |
| **06** | **Autenticación** | Revocación efectiva y expiración de tokens (8 horas). | **APROBADO** | Verificado en prueba automatizada `test_logout_revoca_token_y_bloquea_reuso`. |
| **07** | **Autorización** | Control de acceso por roles (RBAC) en middleware `EnsureRole`. | **APROBADO** | Verificado en `RbacApiTest` (roles: Administrador, Encargado, Empleado). |
| **08** | **API RESTful** | Convenciones REST: recursos en plural y verbos HTTP adecuados (`GET`, `POST`, `PUT`, `DELETE`). | **APROBADO** | Rutas `/api/v1/productos`, `/api/v1/categorias`, `/api/v1/proveedores`, etc. |
| **09** | **API RESTful** | Respuestas JSON consistentes con esquema estándar (`exito`, `mensaje`, `datos`). | **APROBADO** | Heredado de `BaseApiController` para respuestas de éxito y error. |
| **10** | **CRUD** | Operaciones Create, Read, Update, Delete completas en módulos principales. | **APROBADO** | Implementadas en `ProductoApiController`, `CategoriaApiController`, `ProveedorApiController`, etc. |
| **11** | **Validación** | Validación de entradas en el servidor con mensajes descriptivos (código 422). | **APROBADO** | Validadores de Laravel con mensajes personalizados para campos obligatorios y únicos. |
| **12** | **Integridad** | Protección de integridad referencial al eliminar (código 409 Conflict). | **APROBADO** | Verificado en `test_proteccion_integridad_referencial_al_eliminar`. |
| **13** | **Documentación** | Especificación de Requerimientos de Software (SRS) completa. | **APROBADO** | Generado en `documentacion/srs_sistema_inventarios.md`. |
| **14** | **Documentación** | Documentación de endpoints y OpenAPI/Swagger funcional. | **APROBADO** | Archivos `documentacion/api_rest_endpoints.md` y `documentacion/openapi_sistema_inventarios.yaml`. |
| **15** | **Pruebas** | Suite de pruebas automatizadas en PHPUnit ejecutada con 100% de éxito. | **APROBADO** | 13 pruebas, 67 aserciones ejecutadas con `OK`. |
| **16** | **Ejecución Local** | Instructor puede clonar, seguir el README y levantar el proyecto sin bloqueos. | **APROBADO** | Pasos documentados, scripts de inicio comprobados y servidor probado en `http://127.0.0.1:8000`. |
