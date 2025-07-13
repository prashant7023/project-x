const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Enhanced startup logging
console.log('🚀 Starting Dashboard API Server...');
console.log(`📦 Node Version: ${process.version}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔧 MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Missing'}`);
console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Missing'}`);

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/products');

const app = express();

// Trust proxy for production deployment
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Base allowed origins (always included)
    const baseOrigins = [
      'http://localhost:3000',
      'https://prashant-project-x-dashboard.vercel.app'
    ];
    
    // Additional origins from environment variable
    const envOrigins = process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : [];
    
    // Combine all origins and remove duplicates
    const allowedOrigins = [...new Set([...baseOrigins, ...envOrigins])];
    
    console.log(`🌐 CORS request from origin: ${origin || 'no origin'}`);
    console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(`🔧 FRONTEND_URL env: ${process.env.FRONTEND_URL || 'not set'}`);
    
    // Allow requests with no origin (mobile apps, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`✅ CORS allowed for origin: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
};

app.use(cors(corsOptions));

// Explicit handling of preflight requests for all routes
app.options('*', cors(corsOptions));

// Additional CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`🚀 Preflight request for ${req.path} from origin: ${req.headers.origin}`);
    return res.status(200).end();
  }
  
  next();
});

// Request logging middleware (for debugging CORS issues)
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'no origin'}`);
  console.log(`📋 User-Agent: ${req.headers['user-agent']?.substring(0, 50) || 'unknown'}...`);
  
  // Log CORS-related headers
  if (req.method === 'OPTIONS') {
    console.log(`🔍 CORS Preflight Headers:`);
    console.log(`   - Access-Control-Request-Method: ${req.headers['access-control-request-method']}`);
    console.log(`   - Access-Control-Request-Headers: ${req.headers['access-control-request-headers']}`);
  }
  
  next();
});

// Additional detailed logging for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('All Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  });
}

// Custom JSON parsing middleware with error handling
app.use((req, res, next) => {
  express.json({ 
    limit: '10mb'
  })(req, res, (err) => {
    if (err) {
      console.error('JSON parsing error:', err);
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format',
        error: err.message
      });
    }
    next();
  });
});

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection with enhanced error handling
console.log('🔌 Attempting MongoDB connection...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('🔍 Check your MONGODB_URI environment variable');
  // Don't exit the process immediately to allow for health checks
});

// Root endpoint for Render service detection
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Dashboard API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body',
      error: 'Please check your JSON syntax and ensure all brackets and quotes are properly closed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongooseError' || err.name === 'MongoError') {
    return res.status(503).json({
      success: false,
      message: 'Database connection error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Service temporarily unavailable'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'Authentication failed'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: err.message
    });
  }

  // Generic error handler
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

console.log(`🎯 Attempting to start server on ${HOST}:${PORT}...`);

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/api/health`);
  console.log(`📡 API Base URL: http://${HOST}:${PORT}/api`);
}).on('error', (err) => {
  console.error('❌ Server startup error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`🚫 Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown handling
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

module.exports = app;