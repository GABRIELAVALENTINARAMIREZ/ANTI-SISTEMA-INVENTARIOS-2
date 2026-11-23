# Sistema de Gestión de Inventarios GAMA (FastStock)

Sistema integral de gestión de inventarios, stock mínimo, lotes, recetas y proveedores para restaurantes y locales de comidas rápidas.

Construido en **Laravel (PHP)**, **MySQL (XAMPP)**, **Bootstrap 5.3** y versionado con **Liquibase**.

---

## 📌 Requisitos Previos

- **XAMPP** para Windows (con **PHP 8.2+** y **MySQL**).
- **Composer** (disponible en `C:\xampp\php\composer.phar` o instalado en el PATH).
- **Git** (versión 2.30+).
- *(Opcional)* **Liquibase CLI** y **Java Runtime** si se ejecutan despliegues con Liquibase.

---

## 🚀 Instalación y Puesta en Marcha Local

### 1. Clonar el repositorio y ubicarse en la rama `dev`
```bash
git clone https://github.com/GABRIELAVALENTINARAMIREZ/ANTI-SISTEMA-INVENTARIOS-2.git
cd ANTI-SISTEMA-INVENTARIOS-2
git checkout dev
```

### 2. Configurar el archivo de entorno `.env`
Copia el archivo de ejemplo si no existe:
```bash
cp .env.example .env
```
Verifica la conexión a MySQL de XAMPP en `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistema_inventarios
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Iniciar el servicio MySQL en XAMPP
Abre **XAMPP Control Panel** e inicia el módulo de **MySQL** (puerto `3306`).
Crea la base de datos `sistema_inventarios` si aún no existe:
```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS sistema_inventarios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 4. Instalar dependencias con Composer
```powershell
& "C:\xampp\php\php.exe" "C:\xampp\php\composer.phar" install
```

### 5. Generar la clave de la aplicación
```powershell
& "C:\xampp\php\php.exe" artisan key:generate
```

### 6. Ejecutar las Migraciones y Seeders de Laravel
```powershell
& "C:\xampp\php\php.exe" artisan migrate --seed
```

### 7. Iniciar el servidor local de desarrollo
```powershell
& "C:\xampp\php\php.exe" artisan serve --port=8000
```
Abre en tu navegador: [http://localhost:8000](http://localhost:8000).

### 8. Ejecutar la Suite de Pruebas Automatizadas (PHPUnit)
El proyecto cuenta con una suite completa de pruebas unitarias y de integración (13 pruebas, 67 aserciones) que validan autenticación, RBAC, validaciones de entrada y operaciones CRUD:
```powershell
& "C:\xampp\php\php.exe" vendor\bin\phpunit
```

---

## 🔑 Credenciales de Prueba (Sembradas en la Base de Datos)

| Rol | Usuario | Correo Electrónico | Contraseña | Capacidades |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | `cmendoza` | `camila.mendoza@gama.com.co` | `Admin123*` | Control total, CRUD en todos los módulos, borrado de entidades, auditoría |
| **Encargado de inventario** | `jvargas` | `julian.vargas@gama.com.co` | `Inventario123*` | Crear y editar productos, categorías, proveedores, lotes y movimientos; sin permiso de borrado |
| **Empleado** | `mrojas` | `mateo.rojas@gama.com.co` | `Empleado123*` | Consulta de productos, recetas, lotes y registro de consumo operativo diario |

---

## 🔒 Seguridad de la Base de Datos y Principio de Mínimo Privilegio

Para proteger la base de datos MySQL en producción y desarrollo:
- Las credenciales nunca se almacenan en código fuente (gestionadas vía `.env`).
- Se provee el script [`database/security/setup_db_user_least_privilege.sql`](file:///c:/Sistema%20Dee%20Inventario/SISTEMA-INVENTARIOS/ANTI-SISTEMA-INVENTARIOS-2/database/security/setup_db_user_least_privilege.sql) para crear el usuario `app_inventario` limitado a operaciones DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`), evitando que la aplicación tenga permisos destructivos `DROP` o `ALTER`.
- Todas las consultas están blindadas contra **Inyección SQL** mediante el ORM Eloquent y Query Builder parametrizado.
- Contraseñas almacenadas con algoritmo **Bcrypt** y tokens de API almacenados con hash **SHA-256**.

---

## 🌐 API RESTful v1 y Autenticación Bearer

El sistema expone una API completa bajo el prefijo `/api/v1` con autenticación por tokens y control de acceso basado en roles (RBAC: `Administrador`, `Encargado de inventario`, `Empleado`):

- **Login**: `POST /api/v1/auth/login` (emite token Bearer válido por 8 horas).
- **CRUD Productos**: `GET/POST /api/v1/productos`, `GET/PUT/DELETE /api/v1/productos/{id}`.
- **CRUD Categorías**: `GET/POST /api/v1/categorias`, `GET/PUT/DELETE /api/v1/categorias/{id}`.
- **CRUD Proveedores**: `GET/POST /api/v1/proveedores`, `GET/PUT/DELETE /api/v1/proveedores/{id}`.
- **Kardex y Movimientos**: `GET/POST /api/v1/movimientos`, `GET /api/v1/movimientos/{id}` (transaccional atómico con ajuste automático de stock).
- **CRUD Lotes**: `GET/POST /api/v1/lotes`, `GET/PUT/DELETE /api/v1/lotes/{id}`.
- **CRUD Recetas**: `GET/POST /api/v1/recetas`, `GET/PUT/DELETE /api/v1/recetas/{id}`.

Consulta la guía completa de consumo en [`documentacion/api_rest_endpoints.md`](file:///c:/Sistema%20Dee%20Inventario/SISTEMA-INVENTARIOS/ANTI-SISTEMA-INVENTARIOS-2/documentacion/api_rest_endpoints.md) y la especificación OpenAPI en [`documentacion/openapi_sistema_inventarios.yaml`](file:///c:/Sistema%20Dee%20Inventario/SISTEMA-INVENTARIOS/ANTI-SISTEMA-INVENTARIOS-2/documentacion/openapi_sistema_inventarios.yaml).

---

## 🗄️ Control de Versiones de Base de Datos con Liquibase

El proyecto incluye soporte nativo para **Liquibase** en la carpeta `database/liquibase/`:

- **Changelog Maestro**: `database/liquibase/db.changelog-master.xml`
- **Configuración JDBC**: `database/liquibase/liquibase.properties`

### Ejecutar Liquibase:
```cmd
cd database/liquibase
liquibase --defaults-file=liquibase.properties update
```
*(O simplemente hacer doble clic en `run-liquibase.bat`).*

Consulta la documentación detallada en [`documentacion/guia_liquibase.md`](file:///c:/Sistema%20Dee%20Inventario/SISTEMA-INVENTARIOS/ANTI-SISTEMA-INVENTARIOS-2/documentacion/guia_liquibase.md).

---

## 📂 Estructura del Proyecto

```text
├── app/
│   ├── Http/Controllers/       # Controladores (Dashboard, Inventario, Recetas, etc.)
│   ├── Models/                 # Modelos Eloquent con relaciones y casteos
│   └── Providers/              # Proveedores de servicios
├── config/                     # Configuraciones del framework
├── database/
│   ├── migrations/             # 13 migraciones del esquema inicial
│   ├── seeders/                # Datos maestros para poblar el sistema
│   └── liquibase/              # Changelogs XML y properties de Liquibase
├── documentacion/              # Carpeta central de documentación del proyecto
│   ├── README.md               # Propósito de la carpeta
│   ├── arquitectura_sistema.md # Especificación técnica y diagrama ER
│   ├── guia_xampp_mysql.md     # Guía paso a paso de MySQL en XAMPP
│   └── guia_liquibase.md       # Gobernanza y ejecución de Liquibase
├── public/                     # Punto de entrada web y assets
├── resources/
│   └── views/                  # Vistas Blade con Bootstrap 5.3
├── routes/                     # Rutas web (web.php)
├── storage/                    # Logs, sesiones y almacenamiento
├── .env.example                # Plantilla de variables de entorno seguras
└── composer.json               # Dependencias PHP (Laravel 10+)
```

---

## 🌿 Flujo y Organización de Ramas Git

El repositorio está estructurado bajo las siguientes 4 ramas estratégicas:

- **`main`**: Contiene exclusivamente la versión lista para producción que el instructor debe revisar. Incluye el proyecto 100% funcional, configurado y validado.
- **`dev`**: Rama activa de desarrollo donde reside todo el código fuente del sistema, controladores, modelos, migraciones, scripts de base de datos y la suite completa de pruebas PHPUnit.
- **`qa`**: Rama dedicada a los controles de calidad tanto de la aplicación como de la documentación. Contiene el plan de pruebas, checklists de calidad, resultados de ejecución y el informe de hallazgos y correcciones.
- **`documentacion`**: Rama enfocada en los artefactos de diseño y especificación, incluyendo la Especificación de Requerimientos de Software (SRS), la documentación detallada de la API RESTful v1, OpenAPI/Swagger y los CRUD.
