@echo off
echo 🚀 Starting Dashboard Backend Server...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found!
    echo 📋 Please copy .env.example to .env and configure your settings:
    echo    copy .env.example .env
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Start the server
echo 🌟 Starting server in development mode...
echo 📡 Server will be available at: https://dashboard-api-6lqa.onrender.com
echo 🔗 API endpoints at: https://dashboard-api-6lqa.onrender.com/api
echo.
echo 📧 Make sure to configure your email settings in .env
echo 🗄️  Make sure MongoDB is running
echo.

npm run dev
