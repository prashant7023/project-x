#!/bin/bash

# Dashboard Backend Startup Script
echo "🚀 Starting Dashboard Backend Server..."
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "📋 Please copy .env.example to .env and configure your settings:"
    echo "   cp .env.example .env"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "🌟 Starting server in development mode..."
echo "📡 Server will be available at: http://localhost:5000"
echo "🔗 API endpoints at: http://localhost:5000/api"
echo ""
echo "📧 Make sure to configure your email settings in .env"
echo "🗄️  Make sure MongoDB is running"
echo ""

npm run dev
