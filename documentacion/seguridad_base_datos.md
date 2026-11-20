# Manual de Seguridad y Endurecimiento de la Base de Datos

Este documento define las políticas técnicas y buenas prácticas aplicadas para proteger la base de datos MySQL (XAMPP) del **Sistema de Inventarios GAMA (FastStock)**.

---

## 1. Principio de Mínimo Privilegio (Least Privilege Principle)

Una vulnerabilidad común en entornos de desarrollo y producción es utilizar la cuenta de superusuario (`root`) para la conexión diaria de la aplicación. Para mitigar riesgos de escalamiento de privilegios o ejecución de comandos destructivos:

### Cuentas y Roles en la Base de Datos:

1. **Usuario de Aplicación en Tiempo de Ejecución (`app_inventario`)**:
   - **Alcance**: Conexión de Laravel para la API REST y la aplicación web.
   - **Permisos otorgados**: Exclusivamente comandos de manipulación de datos (DML):
     ```sql
     GRANT SELECT, INSERT, UPDATE, DELETE ON sistema_inventarios.* TO 'app_inventario'@'localhost';
     ```
   - **Restricción**: Esta cuenta tiene denegados los privilegios DDL (`DROP TABLE`, `ALTER TABLE`, `TRUNCATE`, `CREATE USER`, `GRANT OPTION`). Si un atacante intentara inyectar un comando `DROP TABLE productos`, el motor MySQL rechazará la operación por falta de permisos.

2. **Usuario Administrativo de Despliegues y Migraciones (`admin_inventario`)**:
   - **Alcance**: Reservado para ejecutar migraciones de Laravel (`php artisan migrate`) y ChangeSets de Liquibase (`liquibase update`).
   - **Permisos**: DDL y DML sobre el esquema `sistema_inventarios.*`.

El script automatizado se encuentra en:  
[`database/security/setup_db_user_least_privilege.sql`](file:///c:/Sistema%20Dee%20Inventario/SISTEMA-INVENTARIOS/ANTI-SISTEMA-INVENTARIOS-2/database/security/setup_db_user_least_privilege.sql).

---

## 2. Protección Contra Inyección SQL (SQL Injection)

Para evitar la concatenación de entradas de usuario en sentencias SQL crudas:

1. **Uso estricto del ORM Eloquent y Query Builder**:
   - Todas las consultas de búsqueda y filtros utilizan enlaces de parámetros (*PDO Parameter Bindings*):
     ```php
     // Consulta parametrizada segura contra inyección SQL:
     $query->where(function ($q) use ($termino) {
         $q->where('nombre', 'LIKE', "%{$termino}%")
           ->orWhere('codigo', 'LIKE', "%{$termino}%");
     });
     ```
   - Se prohíbe el uso de sentencias concatenadas como `DB::raw("SELECT * FROM productos WHERE codigo = '$codigo'")`.

2. **Validación y Sanitización en el Servidor**:
   - Antes de interactuar con la base de datos, cada petición pasa por `Validator::make()` con reglas estrictas de tipo (`integer`, `numeric`, `string`, `max`, `exists`, `unique`).

3. **Bloqueo Pesimista en Transacciones Críticas**:
   - Al registrar salidas de mercancía, se utiliza `Producto::lockForUpdate()` dentro de una transacción `DB::beginTransaction()` para evitar condiciones de carrera (*Race Conditions*) en lecturas concurrentes de stock.

---

## 3. Gestión Segura de Credenciales

1. **Exclusión del Código Fuente**:
   - El archivo `.env` está expresamente ignorado en `.gitignore` para no subir claves ni credenciales a GitHub.
   - Se provee `.env.example` con valores de plantilla sin información sensible.
2. **Separación de Entornos**:
   - En producción, las variables de conexión se inyectan a través de secretos del sistema operativo o gestores como AWS Secrets Manager / HashiCorp Vault.

---

## 4. Almacenamiento Criptográfico de Contraseñas y Tokens

1. **Contraseñas de Usuario**:
   - Se procesan con el algoritmo **Bcrypt** con factor de coste adaptativo (`Hash::make()`), generando hashes únicos con salt automático (ej. `$2y$12$...`).
   - Las contraseñas en texto plano nunca se almacenan ni se transmiten en respuestas JSON (definidas en el atributo `$hidden` del modelo `User`).
2. **Tokens de Portador de la API (Bearer Tokens)**:
   - Al generarse el token, el usuario recibe una cadena criptográfica de 64 caracteres en texto plano una sola vez.
   - En la base de datos (`personal_access_tokens`), solo se almacena su hash unidireccional **SHA-256** (`hash('sha256', $plainToken)`). Incluso si la base de datos fuera filtrada, los tokens activos no pueden ser reconstruidos por un atacante.
   - Cada token incluye una fecha de caducidad automática (`expira_en`).
