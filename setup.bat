@echo off
REM Carbon Fighters - Quick Setup Script for Windows
REM This script helps you get started with the project in seconds

echo.
echo 🌱 Carbon Fighters - Quick Setup
echo ================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed!
    echo 📖 Please install Docker Desktop first:
    echo    https://www.docker.com/products/docker-desktop/
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not running!
    echo 🔧 Please start Docker Desktop and try again
    exit /b 1
)

echo ✅ Docker is installed and running
echo.

REM Setup backend .env if it doesn't exist
if not exist backend\.env (
    echo 📝 Creating backend\.env from .env.example...
    copy backend\.env.example backend\.env
    echo ✅ backend\.env created
) else (
    echo ✅ backend\.env already exists
)

echo.
echo 🐳 Starting PostgreSQL databases with Docker...
docker-compose up -d

echo.
echo ⏳ Waiting for databases to be ready...
timeout /t 5 /nobreak >nul

REM Check if databases are running
docker-compose ps | findstr "carbonfighters-db" | findstr "Up" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Development database is running (port 5432)
) else (
    echo ⚠️  Development database may not be ready yet
)

docker-compose ps | findstr "carbonfighters-db-test" | findstr "Up" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Test database is running (port 5433)
) else (
    echo ⚠️  Test database may not be ready yet
)

echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo 🎉 Setup complete! You're ready to go!
echo.
echo 📝 Next steps:
echo    1. Start the backend:  cd backend ^&^& npm run dev
echo    2. Start the frontend: cd frontend ^&^& npm run dev
echo    3. Open your browser:  http://localhost:5173
echo.
echo 🔧 Useful commands:
echo    • View databases:      docker-compose ps
echo    • Stop databases:      docker-compose stop
echo    • View logs:           docker logs carbonfighters-db
echo    • Connect to DB:       docker exec -it carbonfighters-db psql -U carbonfighters_user -d carbonfighters
echo.
pause
