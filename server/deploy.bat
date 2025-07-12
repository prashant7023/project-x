@echo off
REM Production Deployment Script for Windows
REM This script helps deploy the dashboard backend to production

echo 🚀 Starting production deployment...

REM Check if .env file exists
if not exist .env (
    echo ❌ Error: .env file not found!
    echo Please copy .env.example to .env and configure your production values
    exit /b 1
)

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker is not installed!
    echo Please install Docker and try again
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker Compose is not installed!
    echo Please install Docker Compose and try again
    exit /b 1
)

REM Create logs directory
if not exist logs mkdir logs

REM Build and start services
echo 🏗️  Building Docker images...
docker-compose build --no-cache

echo 🎯 Starting services...
docker-compose up -d

echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if API is healthy
echo 🔍 Checking API health...
set max_attempts=30
set attempt=1

:health_check
curl -f https://dashboard-api-6lqa.onrender.com/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API is healthy!
    goto health_success
)

if %attempt% geq %max_attempts% (
    echo ❌ API health check failed after %max_attempts% attempts
    echo Showing logs...
    docker-compose logs api
    exit /b 1
)

echo ⏳ Attempt %attempt%/%max_attempts% - waiting for API...
timeout /t 2 /nobreak >nul
set /a attempt+=1
goto health_check

:health_success
REM Show running containers
echo 📊 Running containers:
docker-compose ps

echo 🎉 Deployment completed successfully!
echo.
echo 🌐 API is available at: https://dashboard-api-6lqa.onrender.com
echo 📊 Health check: https://dashboard-api-6lqa.onrender.com/api/health
echo.
echo 📋 Useful commands:
echo   - View logs: docker-compose logs -f
echo   - Stop services: docker-compose down
echo   - Restart services: docker-compose restart
echo   - Update services: docker-compose up -d --build

pause
