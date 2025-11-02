# 🔄 Guía de Migración: SQLite a PostgreSQL

## ⚠️ IMPORTANTE - LEE ESTO PRIMERO

Este proyecto ha sido migrado de **SQLite** a **PostgreSQL**. Si ya tenías el proyecto configurado anteriormente, sigue estos pasos para actualizar tu entorno local.

## 📋 Cambios Principales

### Base de Datos
- ✅ **Antes:** SQLite (archivo local)
- ✅ **Ahora:** PostgreSQL (servidor de base de datos)

### Modelo de Usuario
Se agregaron nuevos campos al modelo `User`:
- `cpf` (obligatorio) - Documento de identificación
- `phone` (opcional) - Teléfono
- `birthday` (opcional) - Fecha de nacimiento
- `id` cambió a `id_user`

### Testing
- ✅ Los tests ahora usan una base de datos PostgreSQL separada
- ✅ Se ejecutan automáticamente en GitHub Actions

## 🚀 Pasos para Migrar tu Entorno Local

### 1. Actualiza las dependencias

```bash
cd backend
npm install
```

**Nota:** Se instaló `pg` (driver de PostgreSQL) y se removió la dependencia de SQLite.

### 2. Instala PostgreSQL (si no lo tienes)

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Windows
Descarga e instala desde: https://www.postgresql.org/download/windows/

### 3. Crea las bases de datos

```bash
# Base de datos de desarrollo
psql -U postgres -c "CREATE DATABASE carbonfighters;"

# Base de datos de pruebas
psql -U postgres -c "CREATE DATABASE carbonfighters_test;"
```

**Nota:** Si tu usuario de PostgreSQL no es `postgres`, usa tu usuario correspondiente.

### 4. Ejecuta el script de creación de tablas

```bash
# Para desarrollo
psql -U postgres -d carbonfighters -f data/create_tables.sql

# Para pruebas
psql -U postgres -d carbonfighters_test -f data/create_tables.sql
```

### 5. Configura tus archivos de entorno

#### Archivo `.env` (Desarrollo)

```bash
cp .env.example .env
```

Luego edita `.env` y configura tu contraseña de PostgreSQL:

```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=carbonfighters
DB_PASSWORD=tu_password_real_aqui  # ⬅️ CAMBIA ESTO
DB_PORT=5432
PORT=3000
TOKEN_SECRET=un-secreto-largo-y-aleatorio
```

#### Archivo `.env.test` (Tests)

```bash
cp .env.test.example .env.test
```

Luego edita `.env.test` y configura tu contraseña de PostgreSQL:

```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=carbonfighters_test
DB_PASSWORD=tu_password_real_aqui  # ⬅️ CAMBIA ESTO
DB_PORT=5432
PORT=3001
TOKEN_SECRET=test-secret-key
```

### 6. Verifica que todo funcione

#### Ejecuta el servidor
```bash
npm run dev
```

Deberías ver:
```
Server is running on http://localhost:3000
```

#### Ejecuta los tests
```bash
npm test
```

Deberías ver:
```
Test Suites: 2 passed, 2 total
Tests:       30 passed, 30 total
```

## 🔍 Verificar la instalación de PostgreSQL

### Ver bases de datos creadas
```bash
psql -U postgres -l
```

### Conectarse a una base de datos
```bash
psql -U postgres -d carbonfighters
```

### Ver las tablas
```sql
\dt
```

### Salir de psql
```sql
\q
```

## 🆕 Nuevas Validaciones

### Registro de Usuario
Ahora el endpoint `POST /auth/register` requiere:

**Campos obligatorios:**
- `firstName`
- `lastName`
- `cpf` (11 dígitos)
- `password` (mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales)

**Campos opcionales:**
- `email`
- `phone`
- `birthday` (formato: `YYYY-MM-DD`)

### Ejemplo con Thunder Client / Postman

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

## 🐛 Problemas Comunes

### Error: "password authentication failed"
- Verifica que la contraseña en `.env` sea correcta
- Asegúrate de que el usuario tenga permisos en PostgreSQL

### Error: "database does not exist"
- Ejecuta los comandos CREATE DATABASE del paso 3

### Error: "relation does not exist"
- Ejecuta el script `create_tables.sql` del paso 4

### Los tests fallan con error de conexión
- Verifica que `.env.test` esté configurado correctamente
- Asegúrate de que la base de datos `carbonfighters_test` exista

## 📞 ¿Necesitas ayuda?

Si tienes problemas con la migración:
1. Revisa el archivo `backend/README.md` para más detalles
2. Verifica los logs de error
3. Pregunta en el canal del equipo

## ✅ Checklist de Migración

- [ ] PostgreSQL instalado y corriendo
- [ ] Bases de datos `carbonfighters` y `carbonfighters_test` creadas
- [ ] Tablas creadas con `create_tables.sql`
- [ ] Archivo `.env` configurado con credenciales correctas
- [ ] Archivo `.env.test` configurado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor corre sin errores (`npm run dev`)
- [ ] Tests pasan (`npm test`)

¡Listo! 🎉
