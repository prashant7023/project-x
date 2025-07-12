#!/bin/bash

# Production Deployment Script
# This script helps deploy the dashboard backend to production

set -e

echo "🚀 Starting production deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your production values"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed!"
    echo "Please install Docker and try again"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed!"
    echo "Please install Docker Compose and try again"
    exit 1
fi

# Create logs directory
mkdir -p logs

# Build and start services
echo "🏗️  Building Docker images..."
docker-compose build --no-cache

echo "🎯 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if API is healthy
echo "🔍 Checking API health..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        echo "✅ API is healthy!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ API health check failed after $max_attempts attempts"
        echo "Showing logs..."
        docker-compose logs api
        exit 1
    fi
    
    echo "⏳ Attempt $attempt/$max_attempts - waiting for API..."
    sleep 2
    ((attempt++))
done

# Show running containers
echo "📊 Running containers:"
docker-compose ps

echo "🎉 Deployment completed successfully!"
echo ""
echo "🌐 API is available at: http://localhost:5000"
echo "📊 Health check: http://localhost:5000/api/health"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo "  - Update services: docker-compose up -d --build"
