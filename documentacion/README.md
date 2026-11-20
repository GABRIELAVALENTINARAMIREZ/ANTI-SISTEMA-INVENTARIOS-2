# Carpeta de Documentación del Sistema de Inventarios GAMA (FastStock)

## Propósito de este Directorio
Este directorio centraliza toda la documentación técnica, funcional, de arquitectura, base de datos y guías operativas que se generen a lo largo del ciclo de vida del proyecto.

Cualquier documento futuro (manuales de usuario, especificaciones de nuevos módulos, actas de entrega, diagramas de despliegue o registros de auditoría y pruebas) debe ser almacenado en esta carpeta para mantener el proyecto ordenado y con trazabilidad.

## Contenido Actual

| Archivo | Descripción |
| :--- | :--- |
| **`arquitectura_sistema.md`** | Especificación técnica de la arquitectura en Laravel, entidades adaptadas desde el modelado TypeScript, relaciones de BD y diseño. |
| **`guia_xampp_mysql.md`** | Instrucciones detalladas para configurar y levantar la base de datos MySQL en XAMPP local (`127.0.0.1:3306`). |
| **`guia_liquibase.md`** | Manual operativo de Liquibase: configuración de changelogs maestro/parciales, ejecución contra MySQL de XAMPP y estrategia para evitar duplicidad de esquemas con migraciones de Laravel. |
| **`seguridad_base_datos.md`** | Políticas de seguridad en base de datos: principio de mínimo privilegio, prevención de SQLi, gestión de credenciales y hashing criptográfico. |
| **`api_rest_endpoints.md`** | Catálogo completo de endpoints REST v1, matrices de permisos por rol, códigos HTTP y ejemplos con curl. |
| **`openapi_sistema_inventarios.yaml`** | Especificación estándar OpenAPI 3.0 para importar en Swagger / Postman. |

## Lineamientos para Agregar Nuevos Documentos
1. Usar formato Markdown (`.md`) estándar.
2. Registrar la fecha, autor y versión del documento.
3. Almacenar diagramas en formato mermaid o imágenes en la subcarpeta `documentacion/assets/`.
4. Registrar los cambios en el control de versiones en la rama correspondiente (`dev`).
