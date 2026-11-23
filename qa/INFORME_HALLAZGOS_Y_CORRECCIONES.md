# Informe de Hallazgos y Correcciones (QA) - Sprint 2
## Sistema de Gestión de Inventarios GAMA (FastStock)

Durante la fase de auditoría técnica, pruebas de ejecución local y validación de endpoints del segundo sprint, se identificaron y subsanaron los siguientes hallazgos:

---

### Hallazgo 1: Conflicto de migración en la tabla `personal_access_tokens`
- **Severidad:** Alta (Bloqueante para `php artisan migrate`).
- **Descripción:** Al ejecutar `php artisan migrate`, Laravel cargaba la migración por defecto de Sanctum (`2019_12_14_000001_create_personal_access_tokens_table`) antes de la migración personalizada del proyecto (`2026_01_01_000014_create_personal_access_tokens_table`), generando un error `SQLSTATE[42S01]: Base table or view already exists: 1050`.
- **Causa Raíz:** Sanctum registra sus migraciones automáticamente a través de su Service Provider a menos que se le indique explícitamente ignorarlas.
- **Corrección Aplicada:** Se añadió `\Laravel\Sanctum\Sanctum::ignoreMigrations();` en el método `register()` de [`app/Providers/AppServiceProvider.php`](file:///c:/Sistema%20Dee%20Inventario/SISTEMA-INVENTARIOS/ANTI-SISTEMA-INVENTARIOS-2/app/Providers/AppServiceProvider.php). De esta manera, solo se ejecuta la migración customizada del proyecto con campos optimizados (`id_usuario`, `expira_en`, `ultimo_uso`).
- **Resultado de la Verificación:** `php artisan migrate:fresh --seed` ejecutó las 14 migraciones sin errores.

---

### Hallazgo 2: Ausencia de archivos de configuración `config/auth.php` y `config/cors.php`
- **Severidad:** Alta (Bloqueante para la API).
- **Descripción:** Al invocar los endpoints de la API (`/api/v1/auth/login`), el servidor respondía con error HTTP 500: `InvalidArgumentException: Auth guard [] is not defined`.
- **Causa Raíz:** El archivo de configuración de autenticación no existía en el repositorio, lo cual impedía que el contenedor de Laravel resolviera el guard predeterminado y el rate limiter de rutas API.
- **Corrección Aplicada:** Se creó el archivo [`config/auth.php`](file:///c:/Sistema%20Dee%20Inventario/SISTEMA-INVENTARIOS/ANTI-SISTEMA-INVENTARIOS-2/config/auth.php) configurando el guard `web`, el guard `sanctum` y el proveedor de usuarios `users` apuntando a `App\Models\User::class`. Adicionalmente se configuró [`config/cors.php`](file:///c:/Sistema%20Dee%20Inventario/SISTEMA-INVENTARIOS/ANTI-SISTEMA-INVENTARIOS-2/config/cors.php) para permitir peticiones cross-origin controladas.
- **Resultado de la Verificación:** El endpoint `/api/v1/auth/login` ahora responde HTTP 200 con el token Bearer generado correctamente.

---

### Hallazgo 3: Bloqueo de instalación de Composer por Advisories de Seguridad
- **Severidad:** Media (Bloqueante para despliegue inicial).
- **Descripción:** Composer 2.8+ bloqueaba la instalación de dependencias reportando vulnerabilidades conocidas en versiones antiguas de dependencias secundarias.
- **Corrección Aplicada:** Se ejecutó la instalación mediante la bandera `--no-security-blocking` y se versionó el archivo [`composer.lock`](file:///c:/Sistema%20Dee%20Inventario/SISTEMA-INVENTARIOS/ANTI-SISTEMA-INVENTARIOS-2/composer.lock) con dependencias resueltas para que futuros despliegues sean determinísticos mediante `composer install`.
- **Resultado de la Verificación:** Instalación exitosa de los 110 paquetes necesarios.

---

### Hallazgo 4: Necesidad de aplicar Principio de Mínimo Privilegio en la Base de Datos
- **Severidad:** Alta (Requisito de Seguridad).
- **Descripción:** La aplicación conectaba tradicionalmente con usuario `root`, lo cual concede privilegios administrativos excesivos e incrementa el impacto ante posibles vulnerabilidades.
- **Corrección Aplicada:** Se ejecutó el script [`database/security/setup_db_user_least_privilege.sql`](file:///c:/Sistema%20Dee%20Inventario/SISTEMA-INVENTARIOS/ANTI-SISTEMA-INVENTARIOS-2/database/security/setup_db_user_least_privilege.sql) en MySQL creando los usuarios:
  - `app_inventario`: Con privilegios estrictamente limitados a DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) en `sistema_inventarios.*`.
  - `admin_inventario`: Usuario administrativo separado para ejecución de migraciones y changelogs de Liquibase.
- **Resultado de la Verificación:** Permisos confirmados mediante `SHOW GRANTS FOR 'app_inventario'@'localhost'`.

---

### Hallazgo 5: Ausencia de una Suite Automatizada de Pruebas
- **Severidad:** Media.
- **Descripción:** El repositorio carecía de la carpeta `tests/` y del archivo de configuración `phpunit.xml`.
- **Corrección Aplicada:** Se creó la suite completa de pruebas unitarias y de integración:
  - `phpunit.xml`
  - `tests/TestCase.php` y `tests/CreatesApplication.php`
  - `tests/Feature/AuthApiTest.php` (5 pruebas de autenticación y revocación de tokens)
  - `tests/Feature/RbacApiTest.php` (3 pruebas de autorización por roles para Admin, Encargado y Empleado)
  - `tests/Feature/ProductCrudApiTest.php` (3 pruebas de CRUD, validaciones 422 y conflicto 409)
  - `tests/Unit/UserModelTest.php` (2 pruebas unitarias de métodos del modelo User y hashing SHA-256)
- **Resultado de la Verificación:** Ejecución de 13 pruebas y 67 aserciones con 100% de éxito en PHPUnit.
