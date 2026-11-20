-- ==============================================================================
-- SCRIPT DE SEGURIDAD Y ENDURECIMIENTO DE BASE DE DATOS (MYSQL / MARIADB - XAMPP)
-- Proyecto: Sistema de Inventarios GAMA (FastStock)
-- Principio: Mínimo Privilegio (Least Privilege Principle)
-- ==============================================================================

-- 1. Crear usuario dedicado para la aplicación web y API REST (DML estricto)
-- Este usuario NO tiene privilegios DDL (DROP, ALTER, CREATE) ni de administración.
-- De esta forma, incluso si existiera una brecha remota, el atacante no podrá
-- eliminar tablas, alterar esquemas ni comprometer otras bases de datos del servidor.
CREATE USER IF NOT EXISTS 'app_inventario'@'localhost' IDENTIFIED BY 'GamaInv2026*SecurePass!';
CREATE USER IF NOT EXISTS 'app_inventario'@'127.0.0.1' IDENTIFIED BY 'GamaInv2026*SecurePass!';

-- 2. Conceder ÚNICAMENTE permisos de manipulación de datos (DML) sobre la base del proyecto
GRANT SELECT, INSERT, UPDATE, DELETE ON sistema_inventarios.* TO 'app_inventario'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON sistema_inventarios.* TO 'app_inventario'@'127.0.0.1';

-- 3. Crear usuario administrativo dedicado EXCLUSIVAMENTE a despliegues y migraciones
-- (Liquibase / Laravel Migrate CI/CD), separando la cuenta de ejecución de la cuenta de mantención
CREATE USER IF NOT EXISTS 'admin_inventario'@'localhost' IDENTIFIED BY 'GamaMigrate2026*MasterKey!';
CREATE USER IF NOT EXISTS 'admin_inventario'@'127.0.0.1' IDENTIFIED BY 'GamaMigrate2026*MasterKey!';

GRANT ALL PRIVILEGES ON sistema_inventarios.* TO 'admin_inventario'@'localhost';
GRANT ALL PRIVILEGES ON sistema_inventarios.* TO 'admin_inventario'@'127.0.0.1';

-- 4. Aplicar privilegios en el motor MySQL
FLUSH PRIVILEGES;

-- ==============================================================================
-- VERIFICACIÓN DE PRIVILEGIOS ASIGNADOS
-- ==============================================================================
SHOW GRANTS FOR 'app_inventario'@'localhost';
SHOW GRANTS FOR 'admin_inventario'@'localhost';
