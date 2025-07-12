@echo off
REM build-and-push.bat - Windows batch script for Docker build and push

echo 🏗️  Building and pushing Docker image for dashboard-api...

REM Configuration
set IMAGE_NAME=prashant7023/dashboard-api
set VERSION=1.0.0

echo 📦 Image: %IMAGE_NAME%
echo 🏷️  Version: %VERSION%

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker is not running!
    echo Please start Docker Desktop and try again.
    exit /b 1
)

REM Build image with multiple tags
echo 🏗️  Building Docker image...
docker build -t "%IMAGE_NAME%:%VERSION%" -t "%IMAGE_NAME%:latest" .

if errorlevel 1 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build completed successfully!

REM Test the image locally
echo 🧪 Testing image locally...
docker run -d -p 5001:5000 --name test-dashboard-api "%IMAGE_NAME%:latest"

REM Wait for container to start
echo ⏳ Waiting for container to start...
timeout /t 10 /nobreak >nul

REM Test health endpoint
echo 🔍 Testing health endpoint...
set max_attempts=10
set attempt=1

:health_check
curl -f http://localhost:5001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Health check passed!
    goto health_success
)

if %attempt% geq %max_attempts% (
    echo ❌ Health check failed after %max_attempts% attempts
    echo Container logs:
    docker logs test-dashboard-api
    docker stop test-dashboard-api
    docker rm test-dashboard-api
    exit /b 1
)

echo ⏳ Attempt %attempt%/%max_attempts% - waiting for API...
timeout /t 2 /nobreak >nul
set /a attempt+=1
goto health_check

:health_success
REM Clean up test container
echo 🧹 Cleaning up test container...
docker stop test-dashboard-api
docker rm test-dashboard-api

REM Push to Docker Hub
echo 🚀 Pushing to Docker Hub...
docker push "%IMAGE_NAME%:%VERSION%"
docker push "%IMAGE_NAME%:latest"

if errorlevel 1 (
    echo ❌ Push failed! Make sure you're logged in to Docker Hub:
    echo docker login -u prashant7023
    exit /b 1
)

REM Show success message
echo.
echo 🎉 Successfully built and pushed!
echo 📦 Docker Hub: https://hub.docker.com/r/prashant7023/dashboard-api
echo 🏷️  Tags pushed:
echo    - %IMAGE_NAME%:%VERSION%
echo    - %IMAGE_NAME%:latest
echo.
echo 🚀 To use this image:
echo    docker pull %IMAGE_NAME%:latest
echo    docker run -d -p 5000:5000 %IMAGE_NAME%:latest
echo.
echo 📋 Image details:
docker images | findstr "%IMAGE_NAME%"

pause
