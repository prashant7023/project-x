# 🚀 Backend Deployment Guide

This guide provides multiple deployment options for the Dashboard Backend API.

## 📋 Prerequisites

- Node.js 18+ (for local deployment)
- Docker & Docker Compose (for containerized deployment)
- MongoDB database (local or MongoDB Atlas)
- SSL certificates (for HTTPS)

## 🔧 Environment Configuration

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your production values in `.env`:**
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-domain.com`
   - `MONGODB_URI=mongodb+srv://...` (MongoDB Atlas recommended)
   - `JWT_SECRET=your-secure-random-jwt-secret`
   - Email SMTP configuration
   - Rate limiting settings

## 🐳 Docker Deployment (Recommended)

### Quick Start
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows
deploy.bat
```

### Manual Docker Deployment
```bash
# Build and start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Services Included
- **API Server** (port 5000)
- **MongoDB** (port 27017)
- **Nginx Reverse Proxy** (ports 80/443)

## 🖥️ Local Deployment

### 1. Install Dependencies
```bash
npm install --production
```

### 2. Set Environment
```bash
export NODE_ENV=production
# Or on Windows: set NODE_ENV=production
```

### 3. Start Server
```bash
npm start
```

## ☁️ Cloud Deployment Options

### 1. AWS EC2 + Docker
```bash
# Launch EC2 instance (Ubuntu 20.04+)
# Install Docker & Docker Compose
# Copy project files
# Run deployment script
```

### 2. Google Cloud Run
```bash
# Build Docker image
docker build -t gcr.io/PROJECT_ID/dashboard-api .

# Push to Google Container Registry
docker push gcr.io/PROJECT_ID/dashboard-api

# Deploy to Cloud Run
gcloud run deploy dashboard-api \
  --image gcr.io/PROJECT_ID/dashboard-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 3. Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main
```

### 4. DigitalOcean App Platform
```yaml
# app.yaml
name: dashboard-api
services:
- name: api
  source_dir: /
  github:
    repo: your-username/your-repo
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: your-mongodb-uri
    type: SECRET
```

## 🔒 Security Configuration

### 1. SSL/TLS Setup
- Obtain SSL certificates (Let's Encrypt recommended)
- Update `nginx.conf` with your domain and certificate paths
- Configure HTTPS redirects

### 2. Firewall Rules
```bash
# Allow only necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### 3. Environment Security
- Use strong, unique passwords
- Rotate JWT secrets regularly
- Enable MongoDB authentication
- Use environment variables for secrets

## 📊 Monitoring & Logging

### Health Checks
- Endpoint: `GET /api/health`
- Docker health checks included
- Monitor uptime and response times

### Logging
```bash
# View real-time logs
docker-compose logs -f api

# View specific service logs
docker logs dashboard-api
```

### Performance Monitoring
- Monitor CPU, memory, and disk usage
- Set up alerts for high resource usage
- Monitor database connections

## 🔄 Updates & Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
docker-compose up -d --build

# Or use deployment script
./deploy.sh
```

### Database Backups
```bash
# MongoDB backup
docker exec dashboard-mongodb mongodump --out /backup

# Copy backup from container
docker cp dashboard-mongodb:/backup ./mongodb-backup
```

### Scaling
```bash
# Scale API instances
docker-compose up -d --scale api=3

# Or use Docker Swarm/Kubernetes for advanced scaling
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using port 5000
   netstat -tulpn | grep 5000
   # Kill process or change port in docker-compose.yml
   ```

2. **MongoDB connection issues:**
   - Check MongoDB URI format
   - Verify network connectivity
   - Check MongoDB Atlas IP whitelist

3. **SSL certificate issues:**
   - Verify certificate paths in nginx.conf
   - Check certificate expiration
   - Ensure proper permissions

### Log Analysis
```bash
# API logs
docker-compose logs api | grep ERROR

# Database logs
docker-compose logs mongodb

# Nginx logs
docker-compose logs nginx
```

## 📞 Support

- Check logs first: `docker-compose logs -f`
- Verify environment variables
- Test health endpoint: `curl https://dashboard-api-6lqa.onrender.com/api/health`
- Review security settings

## 🔗 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups scheduled
- [ ] Monitoring set up
- [ ] Firewall rules configured
- [ ] Health checks working
- [ ] Rate limiting tested
- [ ] CORS settings verified
- [ ] Email service configured
- [ ] Performance testing completed
