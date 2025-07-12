#!/bin/bash
# build-and-push.sh - Automated Docker build and push script

set -e

echo "🏗️  Building and pushing Docker image for dashboard-api..."

# Configuration
IMAGE_NAME="prashant7023/dashboard-api"
VERSION=$(grep '"version"' package.json | cut -d'"' -f4 2>/dev/null || echo "1.0.0")

echo "📦 Image: ${IMAGE_NAME}"
echo "🏷️  Version: ${VERSION}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username:"; then
    echo "🔐 Please login to Docker Hub first:"
    echo "docker login -u prashant7023"
    exit 1
fi

# Build image with multiple tags
echo "🏗️  Building Docker image..."
docker build -t "${IMAGE_NAME}:${VERSION}" -t "${IMAGE_NAME}:latest" .

echo "✅ Build completed successfully!"

# Test the image locally
echo "🧪 Testing image locally..."
docker run -d -p 5001:5000 --name test-dashboard-api "${IMAGE_NAME}:latest"

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Test health endpoint
echo "🔍 Testing health endpoint..."
max_attempts=10
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
        echo "✅ Health check passed!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Health check failed after $max_attempts attempts"
        echo "Container logs:"
        docker logs test-dashboard-api
        docker stop test-dashboard-api
        docker rm test-dashboard-api
        exit 1
    fi
    
    echo "⏳ Attempt $attempt/$max_attempts - waiting for API..."
    sleep 2
    ((attempt++))
done

# Clean up test container
echo "🧹 Cleaning up test container..."
docker stop test-dashboard-api
docker rm test-dashboard-api

# Push to Docker Hub
echo "🚀 Pushing to Docker Hub..."
docker push "${IMAGE_NAME}:${VERSION}"
docker push "${IMAGE_NAME}:latest"

# Show image info
echo ""
echo "🎉 Successfully built and pushed!"
echo "📦 Docker Hub: https://hub.docker.com/r/prashant7023/dashboard-api"
echo "🏷️  Tags pushed:"
echo "   - ${IMAGE_NAME}:${VERSION}"
echo "   - ${IMAGE_NAME}:latest"
echo ""
echo "🚀 To use this image:"
echo "   docker pull ${IMAGE_NAME}:latest"
echo "   docker run -d -p 5000:5000 ${IMAGE_NAME}:latest"
echo ""
echo "📋 Image details:"
docker images | grep "${IMAGE_NAME}" | head -2
