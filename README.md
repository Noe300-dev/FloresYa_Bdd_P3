# FloresYa

Tienda de flores. **Frontend** React + Vite · **Backend** Spring Boot + MySQL (carpeta `backend/`).

## Arquitectura del backend (`backend/src/main/java/cl/floresya`)

| Capa | Paquete | Contenido |
|---|---|---|
| Model | `model` | Entidades JPA: `Flor`, `Usuario`, `Pedido`, `ItemPedido` |
| Repository | `repository` | `FlorRepository`, `UsuarioRepository`, `PedidoRepository` (Spring Data JPA → MySQL) |
| Service | `service` | `FlorService`, `UsuarioService`, `PedidoService` (reglas de negocio) |
| Controller | `controller` | `FlorController`, `AuthController`, `UsuarioController`, `PedidoController` |
| Otros | `dto`, `security`, `config`, `exception` | DTOs, Spring Security (roles), datos iniciales, errores en JSON |

Flujo: `React (src/js/api.js)` → `/api/*` → `Controller` → `Service` → `Repository` → `MySQL`.

## Cómo ejecutarlo

1. Tener **MySQL** corriendo (XAMPP / MySQL Server) y **Java 17+** con **Maven**.
2. Si tu MySQL tiene clave, defínela antes de arrancar: variable `DB_PASSWORD` (y `DB_USER` si no es `root`),
   o edita `backend/src/main/resources/application.properties`. La base `floresya` y las tablas se crean solas.
3. Backend: `npm run backend` (o `cd backend && mvn spring-boot:run`) → http://localhost:8080
4. Frontend: `npm install` y `npm run dev` → http://localhost:5173 (Vite redirige `/api` al puerto 8080).

Al primer arranque se cargan las 18 flores del catálogo y dos cuentas:

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@gmail.com | 123456 |
| Cliente | estudiante@duocuc.cl | password123 |

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/flores`, `/api/flores/{id}` | Público |
| POST / PUT / DELETE | `/api/flores[/{id}]` | Administrador |
| GET | `/api/flores/stock-critico` | Administrador |
| POST | `/api/auth/login`, `/api/auth/register` | Público (registro crea rol Cliente) |
| GET | `/api/auth/me` | Con sesión |
| GET / PUT / DELETE | `/api/usuarios`, `/api/usuarios/{id}/rol`, `/api/usuarios/{id}` | Administrador |
| POST | `/api/pedidos` | Con sesión (valida y descuenta stock) |
| GET | `/api/pedidos/mis-pedidos` | Con sesión |
| GET / PUT | `/api/pedidos`, `/api/pedidos/{codigo}/estado` | Administrador |

La autenticación es HTTP Basic sobre la tabla `usuarios` (contraseñas con BCrypt); el frontend envía el header `Authorization` en cada llamada.

## Tests del frontend

`npm test`
