# Carbon Fighters - Backend

Backend API para la aplicación Carbon Fighters, construida con Node.js, Express y TypeScript.

## 🚀 Configuración Inicial

### Requisitos Previos
- **Node.js** 20.x o superior
- **PostgreSQL** 15 o superior
- **npm** o **yarn**

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Base de Datos PostgreSQL

#### Crear las bases de datos

```bash
# Base de datos de desarrollo
psql -U postgres -c "CREATE DATABASE carbonfighters;"

# Base de datos de pruebas
psql -U postgres -c "CREATE DATABASE carbonfighters_test;"
```

#### Ejecutar el script de creación de tablas

```bash
# Para desarrollo
psql -U postgres -d carbonfighters -f data/create_tables.sql

# Para pruebas
psql -U postgres -d carbonfighters_test -f data/create_tables.sql
```

### 3. Configurar Variables de Entorno

#### Archivo `.env` (Desarrollo)

Crea un archivo `.env` en el directorio `backend/` con el siguiente contenido:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=carbonfighters
DB_PASSWORD=tu_password_de_postgres
DB_PORT=5432

# Server Configuration
PORT=3000

# JWT Secret (usa una clave larga y segura)
TOKEN_SECRET=tu-secreto-super-seguro-y-largo-para-jwt-tokens
```

#### Archivo `.env.test` (Tests)

Crea un archivo `.env.test` en el directorio `backend/` con el siguiente contenido:

```env
# Test Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=carbonfighters_test
DB_PASSWORD=tu_password_de_postgres
DB_PORT=5432

# Server Configuration
PORT=3001

# JWT Secret (puede ser diferente del de producción)
TOKEN_SECRET=test-secret-key-for-testing-only
```

**⚠️ IMPORTANTE:** Los archivos `.env` y `.env.test` están en `.gitignore` y NO deben subirse al repositorio por seguridad.

## 🏃 Ejecutar el Proyecto

### Modo Desarrollo (con hot-reload)

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Modo Producción

```bash
npm run build
npm start
```

## 🧪 Ejecutar Tests

```bash
npm test
```

Los tests usan la base de datos `carbonfighters_test` definida en `.env.test`.

**Nota:** Los tests limpian y recrean las tablas automáticamente en cada ejecución.

## 📁 Estructura del Proyecto

```
backend/
├── data/
│   └── create_tables.sql      # Script SQL para crear tablas
├── src/
│   ├── app.ts                 # Configuración de Express
│   ├── server.ts              # Punto de entrada
│   ├── controllers/           # Lógica de negocio de las rutas
│   │   └── auth.controller.ts
│   ├── models/                # Interfaces TypeScript
│   │   └── user.model.ts
│   ├── routes/                # Definición de endpoints
│   │   └── auth.routes.ts
│   ├── services/              # Servicios (DB, tokens, etc.)
│   │   ├── db.service.ts
│   │   ├── token.service.ts
│   │   └── user.service.ts
│   └── utils/                 # Utilidades (validaciones, etc.)
│       └── validations.utils.ts
├── tests/
│   ├── setup.ts               # Configuración global de tests
│   └── auth/                  # Tests de autenticación
│       ├── login.test.ts
│       └── register.test.ts
├── .env                       # Variables de entorno (NO subir a Git)
├── .env.test                  # Variables de entorno para tests (NO subir a Git)
├── .env.example               # Plantilla de variables de entorno
└── package.json
```

## 🔌 API Endpoints

### Autenticación

#### `POST /auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "cpf": "12345678901",
  "email": "juan@example.com",
  "phone": "11999999999",
  "birthday": "2000-01-15",
  "password": "MiPassword123!"
}
```

**Campos obligatorios:** `firstName`, `lastName`, `cpf`, `password`

**Campos opcionales:** `email`, `phone`, `birthday`

**Respuesta exitosa (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id_user": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "cpf": "12345678901",
    "email": "juan@example.com",
    "phone": "11999999999",
    "birthday": "2000-01-15",
    "created_at": "2025-11-01T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /auth/login`
Inicia sesión con email y contraseña.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "MiPassword123!"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🗄️ Esquema de Base de Datos

### Tabla `users`
```sql
id_user      SERIAL PRIMARY KEY
firstName    VARCHAR(100) NOT NULL
lastName     VARCHAR(100) NOT NULL
cpf          VARCHAR(14) NOT NULL UNIQUE
email        VARCHAR(150) UNIQUE
phone        VARCHAR(20)
birthday     DATE
created_at   DATE DEFAULT CURRENT_TIMESTAMP
password     VARCHAR(255) NOT NULL
```

### Tabla `follows`
```sql
follower_id  INTEGER REFERENCES users(id_user)
followed_id  INTEGER REFERENCES users(id_user)
PRIMARY KEY (follower_id, followed_id)
```

### Vista `friends`
Vista que muestra las relaciones de amistad mutua (follows bidireccionales).

## 🔐 Seguridad

- Las contraseñas se hashean con **bcrypt** antes de guardarse
- Los tokens JWT se firman con el `TOKEN_SECRET` del `.env`
- Validación de formato de email
- Validación de fortaleza de contraseña (mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales)

## 🤝 Contribuir

1. Crea una nueva rama desde `main`
2. Haz tus cambios
3. Asegúrate de que los tests pasen: `npm test`
4. Crea un Pull Request

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `npm test` - Ejecuta los tests con Jest
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Ejecuta el servidor compilado (producción)

## ⚙️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Superset de JavaScript con tipado
- **PostgreSQL** - Base de datos relacional
- **pg** - Driver de PostgreSQL para Node.js
- **bcrypt** - Hash de contraseñas
- **jsonwebtoken** - Generación y verificación de JWT
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs HTTP
- **dotenv** - Manejo de variables de entorno
- **CORS** - Habilita peticiones desde el frontend

## 🐛 Troubleshooting

### Error de conexión a la base de datos

Verifica que:
- PostgreSQL esté corriendo: `sudo systemctl status postgresql` (Linux) o `brew services list` (Mac)
- Las credenciales en `.env` sean correctas
- La base de datos exista: `psql -U postgres -l`

### Los tests fallan

Verifica que:
- La base de datos `carbonfighters_test` exista
- El archivo `.env.test` esté configurado correctamente
- No haya otra instancia del servidor corriendo en el mismo puerto
