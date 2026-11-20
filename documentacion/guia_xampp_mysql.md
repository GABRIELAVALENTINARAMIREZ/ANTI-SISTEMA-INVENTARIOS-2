# Guía de Configuración de MySQL en XAMPP

Esta guía describe cómo inicializar y conectar la base de datos MySQL local incluida en XAMPP con el Sistema de Inventarios GAMA.

---

## 1. Parámetros de Conexión Estándar

Los valores configurados en el archivo `.env` del proyecto son los predeterminados de una instalación típica de XAMPP en Windows:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistema_inventarios
DB_USERNAME=root
DB_PASSWORD=
```

> **Nota de Seguridad**: En entornos locales de XAMPP, el usuario `root` no tiene contraseña por defecto. El archivo `.env.example` en el repositorio omite cualquier credencial sensible.

---

## 2. Iniciar Servicios en XAMPP

1. Abre la aplicación **XAMPP Control Panel** (`C:\xampp\xampp-control.exe`).
2. En la fila de **Apache**, haz clic en **Start** (opcional si usas `php artisan serve`).
3. En la fila de **MySQL**, haz clic en **Start**.
4. Verifica que el puerto asignado sea el `3306` y el indicador se vuelva verde.

---

## 3. Crear la Base de Datos

Puedes crear la base de datos mediante cualquiera de las siguientes 3 alternativas:

### Alternativa A: Por línea de comandos de MySQL (XAMPP)
```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS sistema_inventarios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Alternativa B: Mediante phpMyAdmin
1. Abre tu navegador web en [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
2. Haz clic en la pestaña **Bases de datos** (o *New* en el panel izquierdo).
3. Nombre de la base de datos: `sistema_inventarios`.
4. Cotejamiento (Collation): `utf8mb4_unicode_ci`.
5. Haz clic en **Crear**.

### Alternativa C: Mediante Liquibase
El changelog de Liquibase incluye el parámetro `createDatabaseIfNotExist=true` en la cadena JDBC, por lo que creará la base de datos automáticamente al ejecutar:
```cmd
cd database/liquibase
run-liquibase.bat
```

---

## 4. Ejecución de Migraciones y Poblado Inicial (Laravel)

Una vez creada la base de datos y con el servicio MySQL activo en XAMPP, ejecuta en la raíz del proyecto:

```powershell
# Ejecuta las 13 migraciones del sistema
& "C:\xampp\php\php.exe" artisan migrate

# Poblar tablas con datos maestros iniciales (roles, usuarios, categorías, productos, lotes, recetas)
& "C:\xampp\php\php.exe" artisan db:seed
```

O en un solo comando:
```powershell
& "C:\xampp\php\php.exe" artisan migrate --seed
```
