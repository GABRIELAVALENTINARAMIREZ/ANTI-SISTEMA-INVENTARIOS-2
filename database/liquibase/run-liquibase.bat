@echo off
REM Script auxiliar para ejecutar Liquibase contra MySQL de XAMPP
echo ========================================================
echo Ejecutando Liquibase para Sistema de Inventarios GAMA...
echo Conectando a MySQL en localhost:3306 (DB: sistema_inventarios)
echo ========================================================
liquibase --defaults-file=liquibase.properties update
echo Proceso finalizado.
pause
