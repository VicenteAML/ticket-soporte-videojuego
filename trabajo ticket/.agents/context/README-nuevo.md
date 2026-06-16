# 🎮 Ticket Soporte Videojuego

Sistema de tickets de soporte técnico para videojuegos, inspirado en el estilo de Steam.  
API REST con autenticación JWT, panel web integrado y gestión completa de tickets y comentarios.

## Stack tecnológico

| Capa       | Tecnología                     |
|------------|--------------------------------|
| Backend    | Node.js + Express              |
| ORM        | Sequelize                      |
| Base datos | SQLite (`database.sqlite`)     |
| Auth       | JWT (access + refresh tokens)  |
| Frontend   | HTML/CSS/JS (servido estático) |

## Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **Git**

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/VicenteAML/ticket-soporte-videojuego.git

# 2. Entrar a la carpeta del proyecto
cd "ticket-soporte-videojuego/trabajo ticket"

# 3. Instalar dependencias
npm install

# 4. Copiar variables de entorno
cp .env.example .env
```

> En Windows usar: `copy .env.example .env`

## Variables de entorno

Editar el archivo `.env` con los valores deseados:

| Variable              | Descripción                          | Valor por defecto                          |
|-----------------------|--------------------------------------|--------------------------------------------|
| `NODE_ENV`            | Entorno de ejecución                 | `development`                              |
| `PORT`                | Puerto del servidor                  | `3000`                                     |
| `JWT_ACCESS_SECRET`   | Secreto para access tokens           | *(cambiar en producción)*                  |
| `JWT_REFRESH_SECRET`  | Secreto para refresh tokens          | *(cambiar en producción)*                  |
| `JWT_ACCESS_EXPIRES_IN` | Expiración del access token        | `15m`                                      |
| `JWT_REFRESH_EXPIRES_IN`| Expiración del refresh token       | `7d`                                       |
| `DB_STORAGE`          | Ruta de la base de datos SQLite      | `./database.sqlite`                        |

## Ejecución local

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor se levanta en **http://localhost:3000**

## Credenciales de prueba

| Email                  | Contraseña |
|------------------------|------------|
| `profesor@ejemplo.cl`  | `demo1234` |

*(Creadas automáticamente por el seeder al iniciar)*

## Estructura de carpetas

```
trabajo ticket/
├── Public/                         # Frontend (HTML/CSS/JS)
│   ├── login.html                  # Inicio de sesión
│   ├── register.html               # Registro de cuenta
│   ├── dashboard.html              # Panel principal
│   ├── tickets.html                # Crear tickets
│   ├── bandeja.html                # Bandeja con filtros
│   ├── detalle-ticket.html         # Detalle + comentarios
│   ├── comentarios.html            # CRUD de comentarios
│   ├── metricas.html               # Métricas y estadísticas
│   ├── forgot-password.html        # Recuperar contraseña
│   └── reset-password.html         # Restablecer contraseña
├── src/
│   ├── app.js                      # Configuración Express
│   ├── server.js                   # Punto de entrada
│   ├── config/                     # Configuración (DB, env)
│   ├── controllers/                # Lógica de negocio
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   ├── comentarioController.js
│   │   └── passwordController.js
│   ├── middlewares/                 # Auth, errores, validación
│   ├── migrations/                 # Migraciones Sequelize
│   ├── models/                     # Modelos (Usuario, Ticket, Comentario)
│   ├── routes/                     # Rutas de la API
│   ├── seeders/                    # Datos iniciales
│   ├── services/                   # Lógica de auth y tokens
│   ├── utils/                      # Helpers (errores, paginación)
│   └── validators/                 # Validaciones de entrada
├── postman-collection.json         # Colección Postman para testing
├── .env.example                    # Variables de entorno ejemplo
├── .gitignore                      # Archivos excluidos de Git
├── package.json                    # Dependencias y scripts
└── README.md                       # Este archivo
```

## Endpoints de la API

### Autenticación (`/api/auth`)
| Método | Ruta            | Descripción          |
|--------|-----------------|----------------------|
| POST   | `/register`     | Registrar usuario    |
| POST   | `/login`        | Iniciar sesión       |
| POST   | `/refresh-token`| Renovar access token |
| POST   | `/logout`       | Cerrar sesión        |

### Tickets (`/api/tickets`) — *requiere JWT*
| Método | Ruta          | Descripción                    |
|--------|---------------|--------------------------------|
| GET    | `/`           | Listar tickets (con filtros)   |
| GET    | `/:id`        | Ver detalle de un ticket       |
| POST   | `/`           | Crear ticket                   |
| PUT    | `/:id`        | Actualizar ticket              |
| DELETE | `/:id`        | Eliminar ticket                |
| GET    | `/metrics`    | Métricas y estadísticas        |

### Comentarios (`/api/comentarios`) — *requiere JWT*
| Método | Ruta          | Descripción            |
|--------|---------------|------------------------|
| GET    | `/`           | Listar comentarios     |
| GET    | `/:id`        | Ver un comentario      |
| POST   | `/`           | Crear comentario       |
| PUT    | `/:id`        | Actualizar comentario  |
| DELETE | `/:id`        | Eliminar comentario    |

### Contraseña (`/api/password`)
| Método | Ruta            | Descripción                |
|--------|-----------------|----------------------------|
| POST   | `/forgot`       | Solicitar reset de clave   |
| POST   | `/reset/:token` | Restablecer contraseña     |

## Testing con Postman

Importar `postman-collection.json` en Postman para probar todos los endpoints.

## Autor

**Vicente AML** — Proyecto final de desarrollo web
