# 🚀 Render Deployment Guide

## ✅ Fixes Applied

Your server has been updated with the following Render-specific optimizations:

### 1. **Port Binding Fix**
```javascript
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/api/health`);
});
```

### 2. **Graceful Shutdown Handling**
```javascript
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
```

### 3. **Root Route for Service Detection**
```javascript
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Dashboard API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});
```

### 4. **Enhanced Health Check**
```javascript
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 🔧 Deploy to Render

### Option 1: Docker Deployment (Recommended)

1. **Go to [Render Dashboard](https://render.com/)**
2. **Click "New +" → "Web Service"**
3. **Select "Deploy an existing image from a registry"**
4. **Image URL**: `prashant7023/dashboard-api:latest`
5. **Configure the service**:
   - **Name**: `dashboard-api`
   - **Region**: Choose your preferred region
   - **Branch**: Not needed for Docker
   - **Build Command**: Leave empty
   - **Start Command**: `npm start`

### Option 2: GitHub Repository Deployment

1. **Push your code to GitHub**
2. **Go to [Render Dashboard](https://render.com/)**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure the service**:
   - **Name**: `dashboard-api`
   - **Environment**: `Node`
   - **Region**: Choose your preferred region
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## 🔐 Environment Variables

Set these in Render's Environment Variables section:

```bash
# Required
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secure-jwt-secret-key

# Optional
FRONTEND_URL=https://your-frontend.vercel.app,https://your-frontend.netlify.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🌐 Custom Domain (Optional)

1. Go to your service dashboard on Render
2. Click "Settings" → "Custom Domains"
3. Add your domain (e.g., `api.yourdomain.com`)
4. Update your DNS records as instructed

## 📊 Health Check Endpoints

- **Root**: `https://your-service.onrender.com/`
- **Health**: `https://your-service.onrender.com/api/health`
- **API Status**: Check if all endpoints respond correctly

## 🔍 Monitoring

Render will automatically:
- ✅ Monitor your service health
- ✅ Restart if the service crashes
- ✅ Provide logs in the dashboard
- ✅ Handle HTTPS certificates
- ✅ Scale based on traffic (paid plans)

## 🐛 Troubleshooting

### Common Issues:

1. **Service won't start**:
   - Check that `PORT` environment variable is being used
   - Verify MongoDB connection string
   - Check logs for specific errors

2. **Health check fails**:
   - Ensure `/api/health` endpoint returns 200 status
   - Verify service binds to `0.0.0.0:$PORT`

3. **Database connection issues**:
   - Whitelist Render's IP addresses in MongoDB Atlas
   - Verify MongoDB URI format and credentials

### Render IP Whitelist for MongoDB Atlas:
```
0.0.0.0/0 (Allow all - simplest for development)
```
Or use specific Render IP ranges (check Render docs for latest ranges)

## 🎯 Next Steps

1. Deploy your service to Render
2. Test all API endpoints
3. Update your frontend to use the new API URL
4. Set up monitoring and alerts
5. Configure custom domain (optional)

Your server is now **Render-ready** with proper port binding, graceful shutdown, and health checks! 🚀
