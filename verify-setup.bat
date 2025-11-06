@echo off
REM ==================================
REM CarbonFighters - Quick Setup Check
REM ==================================
REM This script helps verify your setup is correct

echo.
echo ========================================
echo    CarbonFighters Setup Verification
echo ========================================
echo.

setlocal enabledelayedexpansion
set ERRORS=0

REM Check 1: Docker installed
echo [1/6] Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker is installed
    docker --version
) else (
    echo [ERROR] Docker is NOT installed
    echo    Solution: Install from https://www.docker.com/products/docker-desktop/
    set /a ERRORS+=1
)
echo.

REM Check 2: Docker running
echo [2/6] Checking if Docker is running...
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker daemon is running
) else (
    echo [ERROR] Docker is not running
    echo    Solution: Open Docker Desktop and wait for it to start
    set /a ERRORS+=1
)
echo.

REM Check 3: .env file exists
echo [3/6] Checking backend\.env file...
if exist "backend\.env" (
    echo [OK] backend\.env exists
    
    REM Check if it has correct values
    findstr /C:"DB_USER=carbonfighters_user" backend\.env >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] .env has correct Docker credentials
    ) else (
        echo [ERROR] .env has incorrect credentials
        echo    Solution: Run 'cd backend' and 'copy .env.example .env'
        set /a ERRORS+=1
    )
) else (
    echo [ERROR] backend\.env does NOT exist
    echo    Solution: Run 'cd backend' and 'copy .env.example .env'
    set /a ERRORS+=1
)
echo.

REM Check 4: .env.test file exists
echo [4/6] Checking backend\.env.test file...
if exist "backend\.env.test" (
    echo [OK] backend\.env.test exists
    
    REM Check if it has correct values
    findstr /C:"DB_USER=carbonfighters_user" backend\.env.test >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] .env.test has correct Docker credentials
    ) else (
        echo [ERROR] .env.test has incorrect credentials
        echo    Solution: Run 'cd backend' and 'copy .env.example .env.test'
        set /a ERRORS+=1
    )
) else (
    echo [ERROR] backend\.env.test does NOT exist
    echo    Solution: Run 'cd backend' and 'copy .env.example .env.test'
    set /a ERRORS+=1
)
echo.

REM Check 5: Docker containers
echo [5/6] Checking Docker containers...
docker-compose ps 2>nul | findstr "carbonfighters-db" >nul 2>&1
if %errorlevel% equ 0 (
    docker-compose ps | findstr "carbonfighters-db" | findstr "Up" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] Docker containers are running
        docker-compose ps
    ) else (
        echo [WARNING] Docker containers exist but are not running
        echo    Solution: Run 'docker-compose start'
        set /a ERRORS+=1
    )
) else (
    echo [ERROR] Docker containers don't exist
    echo    Solution: Run 'docker-compose up -d'
    set /a ERRORS+=1
)
echo.

REM Check 6: Node modules
echo [6/6] Checking dependencies...
if exist "backend\node_modules\" (
    echo [OK] Backend dependencies installed
) else (
    echo [WARNING] Backend dependencies not installed
    echo    Solution: Run 'cd backend' and 'npm install'
    set /a ERRORS+=1
)

if exist "frontend\node_modules\" (
    echo [OK] Frontend dependencies installed
) else (
    echo [WARNING] Frontend dependencies not installed
    echo    Solution: Run 'cd frontend' and 'npm install'
    set /a ERRORS+=1
)
echo.

REM Summary
echo ========================================
if %ERRORS% equ 0 (
    echo.
    echo SUCCESS! All checks passed! You're ready to code!
    echo.
    echo Next steps:
    echo   1. Start backend:  cd backend ^&^& npm run dev
    echo   2. Start frontend: cd frontend ^&^& npm run dev
    echo   3. Open browser:   http://localhost:5173
    echo.
) else (
    echo.
    echo ERROR! Found %ERRORS% issue^(s^) - Please fix them above
    echo.
    echo Need help? Read:
    echo   - QUICK_START.md ^(Portuguese^)
    echo   - README.md ^(Overview^)
    echo.
)
echo ========================================
echo.

pause
