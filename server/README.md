# Dashboard Application Backend

A robust Node.js backend server with Email OTP authentication, MongoDB integration, and comprehensive API endpoints for the dashboard application.

## 🚀 Features

- **Email OTP Authentication**: Secure email-based login with beautiful, responsive emails
- **MongoDB Integration**: User management and data persistence
- **Beautiful Email Templates**: Mobile-responsive emails using HTML/CSS
- **Rate Limiting**: Protection against brute force attacks
- **Caching**: In-memory caching for improved performance
- **Product Analytics**: Advanced analytics and insights
- **Security**: JWT tokens, bcrypt hashing, CORS, and Helmet protection

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Email service (Gmail, Outlook, or any SMTP provider)

## 🛠️ Installation

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/dashboard-app

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Email Configuration (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

## 📧 Email Setup

### Gmail Setup:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
3. Use this app password in your `.env` file

### Other Email Providers:
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **SendGrid**: `smtp.sendgrid.net:587`

## 🚀 Running the Server

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📱 API Endpoints

### Authentication

#### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Resend OTP
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### User Management

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/user/logout
Authorization: Bearer <token>
```

### Products

#### Get Products
```http
GET /api/products?limit=100&skip=0
GET /api/products?category=smartphones
GET /api/products?search=phone
```

#### Get Product Categories
```http
GET /api/products/categories
```

#### Get Analytics
```http
GET /api/products/analytics
```

#### Get Single Product
```http
GET /api/products/:id
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for OTP hashing
- **CORS Protection**: Configured for frontend origin
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation

## 📊 Analytics Features

The backend provides comprehensive analytics including:
- Category distribution
- Price range analysis
- Rating distribution
- Stock status tracking
- Top performing categories
- Total inventory value

## 🎨 Email Templates

The backend includes beautifully designed, mobile-responsive email templates:

### OTP Email Features:
- Modern gradient design
- Large, easy-to-read OTP code
- Security reminders
- Mobile-responsive layout
- Professional branding

### Confirmation Email Features:
- Success-focused design
- Feature highlights
- Call-to-action button
- Professional layout

## 🔧 Database Schema

### User Model:
```javascript
{
  email: String (unique, required),
  isEmailVerified: Boolean,
  otp: {
    code: String,
    expiresAt: Date,
    attempts: Number
  },
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 Production Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dashboard-app
JWT_SECRET=your-very-secure-secret-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Platforms:
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Modern platform with automatic deployments
- **Render**: Free tier with database support
- **DigitalOcean**: VPS with full control

## 📝 API Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## 🛡️ Error Handling

The backend includes comprehensive error handling:
- Validation errors
- Database connection errors
- Email sending failures
- Authentication errors
- Rate limiting
- 404 routes

## 🔍 Monitoring

### Health Check:
```http
GET /api/health
```

Returns server status, uptime, and timestamp.

## 📚 Development

### Project Structure:
```
server/
├── index.js              # Main server file
├── package.json          # Dependencies
├── .env.example          # Environment template
├── models/
│   └── User.js           # User model
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── user.js           # User routes
│   └── products.js       # Product routes
└── services/
    └── emailService.js   # Email service
```

### Adding New Features:
1. Create new route files in `routes/`
2. Add models in `models/`
3. Update `index.js` to include new routes
4. Add appropriate middleware and validation

## 📞 Support

For issues or questions:
1. Check the logs for detailed error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Test email configuration with your SMTP provider

## 🔄 Future Enhancements

Potential improvements:
- Redis for caching and session management
- WebSocket support for real-time updates
- File upload capabilities
- Advanced analytics with time-series data
- Multi-language email templates
- OAuth integration (Google, GitHub)
- API versioning
- Comprehensive logging with Winston
