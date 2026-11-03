-- La aplicación crea la base y las tablas sola (ddl-auto=update).
-- Este script es opcional: úsalo si prefieres crear la base a mano en MySQL Workbench / phpMyAdmin.
CREATE DATABASE IF NOT EXISTS floresya CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE floresya;

-- Consultas útiles una vez que el backend haya arrancado:
-- SELECT id, codigo, nombre, precio, stock FROM flores;
-- SELECT id, nombre, correo, rol FROM usuarios;
-- SELECT p.codigo, p.fecha, p.total, p.estado FROM pedidos p ORDER BY p.id DESC;
