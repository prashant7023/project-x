# Docker Build and Push Guide

## 🐳 Building and Pushing Docker Image

### Step 1: Start Docker Desktop
1. **Start Docker Desktop** on Windows
2. Wait for Docker to fully start (you'll see the Docker whale icon in system tray)
3. Verify Docker is running: `docker --version`

### Step 2: Login to Docker Hub
```bash
# Option 1: Interactive login
docker login

# Option 2: Login with username (will prompt for password)
docker login -u prashant7023

# Option 3: Use Personal Access Token (recommended)
# 1. Go to https://app.docker.com/settings/personal-access-tokens
# 2. Create new token
# 3. Use token as password
```

### Step 3: Build the Docker Image
```bash
cd D:\project-x\server

# Build with latest tag
docker build -t prashant7023/dashboard-api:latest .

# Build with version tag
docker build -t prashant7023/dashboard-api:v1.0.0 .

# Build with multiple tags
docker build -t prashant7023/dashboard-api:latest -t prashant7023/dashboard-api:v1.0.0 .
```

### Step 4: Test the Image Locally
```bash
# Run the container locally to test
docker run -d -p 5000:5000 --name test-api prashant7023/dashboard-api:latest

# Check if it's running
docker ps

# Test the health endpoint
curl https://dashboard-api-6lqa.onrender.com/api/health

# Stop and remove test container
docker stop test-api
docker rm test-api
```

### Step 5: Push to Docker Hub
```bash
# Push latest tag
docker push prashant7023/dashboard-api:latest

# Push specific version
docker push prashant7023/dashboard-api:v1.0.0

# Push all tags
docker push prashant7023/dashboard-api --all-tags
```

### Step 6: Verify on Docker Hub
1. Go to https://hub.docker.com/r/prashant7023/dashboard-api
2. Check that your image is available
3. Verify the tags and build information

## 🚀 Automated Build Script

Here's a complete script to build and push:

```bash
#!/bin/bash
# build-and-push.sh

set -e

echo "🏗️  Building Docker image..."

# Get version from package.json or use default
VERSION=$(grep '"version"' package.json | cut -d'"' -f4 || echo "1.0.0")
IMAGE_NAME="prashant7023/dashboard-api"

# Build image with multiple tags
echo "Building ${IMAGE_NAME}:${VERSION} and ${IMAGE_NAME}:latest"
docker build -t "${IMAGE_NAME}:${VERSION}" -t "${IMAGE_NAME}:latest" .

echo "✅ Build completed successfully!"

# Test the image
echo "🧪 Testing image locally..."
docker run -d -p 5001:5000 --name test-api "${IMAGE_NAME}:latest"

# Wait for container to start
sleep 5

# Test health endpoint
if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    docker logs test-api
    docker stop test-api
    docker rm test-api
    exit 1
fi

# Clean up test container
docker stop test-api
docker rm test-api

echo "🚀 Pushing to Docker Hub..."

# Push both tags
docker push "${IMAGE_NAME}:${VERSION}"
docker push "${IMAGE_NAME}:latest"

echo "🎉 Successfully pushed ${IMAGE_NAME}:${VERSION} and ${IMAGE_NAME}:latest"
echo "📦 Image available at: https://hub.docker.com/r/prashant7023/dashboard-api"
```

## 🔧 Usage Instructions

### For Others to Use Your Image:
```bash
# Pull and run your image
docker pull prashant7023/dashboard-api:latest
docker run -d -p 5000:5000 --env-file .env prashant7023/dashboard-api:latest

# Or use docker-compose (update image in docker-compose.yml)
services:
  api:
    image: prashant7023/dashboard-api:latest
    # ... rest of configuration
```

### Environment Variables for Container:
```bash
# Run with environment variables
docker run -d -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-jwt-secret \
  -e FRONTEND_URL=https://your-frontend.com \
  prashant7023/dashboard-api:latest
```

## 📝 Next Steps After Push:

1. **Update docker-compose.yml** to use your image instead of building locally
2. **Create GitHub Actions** for automated builds
3. **Set up automatic builds** on Docker Hub
4. **Document deployment** instructions for users

## 🐛 Troubleshooting:

- **Docker Desktop not running**: Start Docker Desktop and wait for it to fully load
- **Login issues**: Use Personal Access Token instead of password
- **Build fails**: Check Dockerfile syntax and file paths
- **Push fails**: Ensure you're logged in and have push permissions
