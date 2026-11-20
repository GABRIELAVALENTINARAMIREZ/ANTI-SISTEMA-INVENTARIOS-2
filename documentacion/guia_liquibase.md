# Guía de Uso de Liquibase y Estrategia con Laravel

## 1. ¿Qué es Liquibase y cuál es su rol en este proyecto?
Liquibase es una herramienta agnóstica de control de versiones de bases de datos que permite registrar, auditar y desplegar cambios en el esquema y datos de forma declarativa (XML, YAML, SQL) a través de un historial inmutable almacenado en la tabla `DATABASECHANGELOG`.

En este proyecto, Liquibase actúa como el **versionador corporativo de la base de datos MySQL** de XAMPP, permitiendo que cualquier entorno (Dev, QA, Staging, Producción) aplique la estructura exacta sin depender de herramientas propietarias.

---

## 2. Estructura de Changelogs en el Proyecto

Los archivos se ubican en `database/liquibase/`:
```text
database/liquibase/
├── db.changelog-master.xml          # Changelog principal que orquesta la ejecución
├── liquibase.properties             # Parámetros de conexión JDBC a MySQL XAMPP
├── run-liquibase.bat                # Script de ejecución rápida para Windows
└── changelogs/                      # Changelogs atómicos y modulares
    ├── 01-create-roles-table.xml
    ├── 02-create-usuarios-table.xml
    ├── 03-create-categorias-table.xml
    ├── 04-create-proveedores-table.xml
    ├── 05-create-ubicaciones-table.xml
    ├── 06-create-productos-table.xml
    ├── 07-create-movimientos-table.xml
    ├── 08-create-detalle-movimientos-table.xml
    ├── 09-create-recetas-table.xml
    ├── 10-create-detalle-recetas-table.xml
    ├── 11-create-lotes-table.xml
    ├── 12-create-notificaciones-table.xml
    ├── 13-create-auditoria-table.xml
    └── 14-initial-seed-data.xml
```

---

## 3. Conexión contra MySQL de XAMPP

El archivo `database/liquibase/liquibase.properties` está preconfigurado:
```properties
changeLogFile=db.changelog-master.xml
url=jdbc:mysql://localhost:3306/sistema_inventarios?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
username=root
password=
driver=com.mysql.cj.jdbc.Driver
classpath=drivers/mysql-connector-j.jar
logLevel=info
```

### Pasos de ejecución:
1. Asegurarse de tener el servicio MySQL iniciado en **XAMPP Control Panel**.
2. Abrir una terminal en `database/liquibase/` y ejecutar:
   ```bash
   liquibase update
   ```
   O ejecutar el archivo por lotes `run-liquibase.bat`.
3. Para verificar el estado de los cambios sin aplicar:
   ```bash
   liquibase status --verbose
   ```
4. Para revertir el último lote de cambios:
   ```bash
   liquibase rollbackCount 1
   ```

---

## 4. Estrategia de Convivencia: Liquibase vs. Migraciones de Laravel

Tanto Laravel (`php artisan migrate`) como Liquibase tienen capacidad de alterar la base de datos. Para **evitar duplicidad de control, conflictos de locks o estados inconsistentes**, se define la siguiente estrategia técnica:

### Regla de Oro: "Single Source of Truth" (Fuente Única de Verdad)

1. **Flujo de desarrollo estándar en este proyecto**:
   - En entornos locales rápidos de desarrollo PHP, el desarrollador puede usar `php artisan migrate --seed` para iterar rápidamente en Laravel.
   - En los despliegues de ciclo de vida formal (CI/CD, QA y Producción), **Liquibase es la herramienta rectora de base de datos**.

2. **Cómo evitar errores de colisión**:
   - **Opción A (Recomendada - Liquibase Leading)**: Ejecutar primero Liquibase en la base de datos limpia (`sistema_inventarios`). Cuando Laravel se conecte, la base de datos ya contiene todas las tablas. Si se desea marcar las migraciones de Laravel como ya ejecutadas sin recrear las tablas, se usa:
     ```bash
     # Sincroniza la tabla de migraciones de Laravel sin ejecutar el DDL
     php artisan migrate --pretend
     ```
   - **Opción B (Laravel Leading con Liquibase Sync)**: Si las tablas se crearon inicialmente mediante Laravel (`php artisan migrate`), se debe registrar en Liquibase que los cambios ya existen para evitar que intente un `CREATE TABLE` duplicado:
     ```bash
     cd database/liquibase
     liquibase changelogSync
     ```
     El comando `changelogSync` marca todos los changeSets del changelog maestro como aplicados en la tabla `DATABASECHANGELOG` sin alterar las tablas físicas.

3. **Gobernanza de Nuevos Cambios**:
   - Cada nueva tabla o columna añadida al sistema debe tener simultáneamente su archivo de migración en `database/migrations/` (para desarrollo local Laravel) y su ChangeSet en `database/liquibase/changelogs/` (para despliegues versionados).
