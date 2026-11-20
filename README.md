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

## 🌿 Flujo de Ramas Git

- `main`: Rama de producción (protegida, no tocar en esta fase).
- `qa`: Rama de control de calidad y pruebas.
- `dev`: Rama activa de desarrollo (donde residen todas las confirmaciones actuales).
