# 🚀 Dashboard Application

A modern, full-stack dashboard application with Email OTP authentication, beautiful UI, and comprehensive analytics. Built with Next.js, TailwindCSS, Node.js, and MongoDB.

## ✨ Features

### 🔐 Authentication System
- **Email OTP Login**: Secure authentication using one-time passwords
- **Beautiful Emails**: Mobile-responsive email templates using HTML/CSS
- **Resend Functionality**: Users can request new OTP codes
- **JWT Security**: Secure token-based authentication

### 📊 Dashboard Interface
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Built with shadcn/ui components and TailwindCSS
- **Sidebar Navigation**: Clean, intuitive navigation
- **Product Analytics**: Comprehensive data visualization

### 📈 Analytics & Insights
- **Product Analytics**: Category distribution, price ranges, ratings
- **Interactive Charts**: Built with Recharts
- **Real-time Data**: Live updates from DummyJSON API
- **Performance Metrics**: Stock status, inventory value

### 🛡️ Security & Performance
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive data validation
- **Caching**: Improved performance with smart caching
- **CORS Protection**: Secure cross-origin requests

## 🖥️ Live Demo

🌐 **Frontend (Vercel)**: [https://prashant-project-x-dashboard.vercel.app](https://prashant-project-x-dashboard.vercel.app)

🚀 **Backend API (Render)**: [https://dashboard-api-6lqa.onrender.com](https://dashboard-api-6lqa.onrender.com)

📋 **API Health Check**: [https://dashboard-api-6lqa.onrender.com/api/health](https://dashboard-api-6lqa.onrender.com/api/health)

### 🎯 How to Test the Live Application

1. **Visit the Frontend**: Go to [https://prashant-project-x-dashboard.vercel.app](https://prashant-project-x-dashboard.vercel.app)
2. **Enter your email** in the authentication form
3. **Check your email** for the 6-digit OTP code
4. **Enter the OTP** and access the dashboard
5. **Explore features**:
   - View product analytics
   - Navigate between tabs
   - Responsive design on mobile/desktop

## 📱 Screenshots

### Authentication Flow
![Auth Flow](https://via.placeholder.com/800x400?text=Authentication+Flow)

### Dashboard Interface
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Interface)

### Email Templates
![Email Templates](https://via.placeholder.com/800x400?text=Email+Templates)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13 with App Router
- **Styling**: TailwindCSS
- **Components**: shadcn/ui (Radix UI)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Email service (Gmail, Outlook, etc.)

### 1. Clone the Repository
```bash
git clone https://github.com/prashant7023/project-x.git
cd project-x
```

### 2. Set Up the Backend
```bash
cd server
npm install
cp .env.example .env
# Configure your .env file (see Backend Setup below)
npm run dev
```

### 3. Set Up the Frontend
```bash
cd .. # Go back to root
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Live Frontend**: https://prashant-project-x-dashboard.vercel.app
- **Live Backend**: https://dashboard-api-6lqa.onrender.com

## ⚙️ Backend Setup

### Environment Configuration
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000,https://prashant-project-x-dashboard.vercel.app

# Database Configuration
MONGODB_URI=your-mongodb-connection-string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Gmail Setup for Email OTP
1. Enable 2-factor authentication
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Use the generated password in your `.env` file

### MongoDB Setup
**Local MongoDB:**
```bash
# Install MongoDB locally
# macOS: brew install mongodb-community
# Windows: Download from mongodb.com
# Ubuntu: sudo apt install mongodb

# Start MongoDB
mongod
```

**MongoDB Atlas (Cloud):**
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## 🎨 Frontend Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://dashboard-api-6lqa.onrender.com/api
```

### Styling Customization
The app uses TailwindCSS with shadcn/ui components. Customize the theme in:
- `tailwind.config.ts`
- `app/globals.css`
- `components.json`

## 📊 API Documentation

### Authentication Endpoints

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

### Product Endpoints

#### Get Products
```http
GET /api/products?limit=100&skip=0
GET /api/products?category=smartphones
GET /api/products?search=phone
```

#### Get Analytics
```http
GET /api/products/analytics
```

### User Endpoints

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

## 🎯 Usage Guide

### 1. Authentication
1. Enter your email address
2. Check your email for the OTP code
3. Enter the 6-digit OTP
4. Get redirected to the dashboard

### 2. Dashboard Navigation
- **Products Tab**: View and filter products
- **Analytics Tab**: View comprehensive analytics
- **Sidebar**: Navigate between sections

### 3. Product Analytics
- **Category Distribution**: See product distribution by category
- **Price Analysis**: Understand price ranges
- **Rating Insights**: Product quality metrics
- **Stock Status**: Inventory management

## 🚀 Deployment

### ✅ Current Deployments

- **Frontend**: Deployed on [Vercel](https://prashant-project-x-dashboard.vercel.app)
- **Backend**: Deployed on [Render](https://dashboard-api-6lqa.onrender.com)
- **Database**: MongoDB Atlas Cloud

### 🔧 Deployment Configuration

#### Frontend (Vercel)
The frontend is automatically deployed from the `main` branch using Vercel's GitHub integration.

**Environment Variables on Vercel:**
```env
NEXT_PUBLIC_API_URL=https://dashboard-api-6lqa.onrender.com/api
```

#### Backend (Render)
The backend is deployed using Docker on Render.

**Environment Variables on Render:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-production-jwt-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:3000,https://prashant-project-x-dashboard.vercel.app
```

### Manual Deployment Instructions

#### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

#### Backend Deployment (Render)
```bash
# The backend uses Docker deployment on Render
# Docker image: prashant7023/dashboard-api:latest
# Automatically deploys from Docker Hub when image is updated
```

### Alternative Deployment Options
- **Frontend**: Netlify, Vercel, GitHub Pages, Surge
- **Backend**: Railway, Render, Heroku, DigitalOcean, AWS
- **Database**: MongoDB Atlas, PlanetScale, FaunaDB

## 📊 Deployment Status

### ✅ Production Status
- **Frontend**: ✅ Live at [prashant-project-x-dashboard.vercel.app](https://prashant-project-x-dashboard.vercel.app)
- **Backend API**: ✅ Live at [dashboard-api-6lqa.onrender.com](https://dashboard-api-6lqa.onrender.com)
- **Database**: ✅ MongoDB Atlas Cloud
- **Email Service**: ✅ Gmail SMTP
- **CORS**: ✅ Configured for Vercel domain

### 🔍 API Endpoints (Live)
- **Health Check**: `GET https://dashboard-api-6lqa.onrender.com/api/health`
- **Send OTP**: `POST https://dashboard-api-6lqa.onrender.com/api/auth/send-otp`
- **Verify OTP**: `POST https://dashboard-api-6lqa.onrender.com/api/auth/verify-otp`
- **Get Products**: `GET https://dashboard-api-6lqa.onrender.com/api/products`
- **Analytics**: `GET https://dashboard-api-6lqa.onrender.com/api/products/analytics`

### 🛠️ Troubleshooting

#### Common Issues
1. **CORS Errors**: The backend is configured to allow requests from the Vercel domain
2. **Slow Initial Load**: Render services may take 30-60 seconds to wake up if idle
3. **Email Delivery**: Check spam folder for OTP emails

#### Testing the Application
1. Visit the live frontend URL
2. Enter a valid email address
3. Check email for OTP (including spam folder)
4. Enter the 6-digit code
5. Explore the dashboard features

## 📂 Repository Information

- **Repository**: [https://github.com/prashant7023/project-x](https://github.com/prashant7023/project-x)
- **Branch**: `main`
- **Latest Commit**: Production-ready with full deployment

## 📁 Project Structure

```
dashboard-app/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Authentication page
│   └── dashboard/
│       └── page.tsx       # Dashboard page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility functions
│   ├── api-client.ts     # API client
│   └── utils.ts          # Utility functions
├── hooks/                # Custom React hooks
├── server/               # Backend server
│   ├── index.js          # Main server file
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── services/         # Services (email, etc.)
└── package.json          # Dependencies
```

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

**Backend:**
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
```

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety for frontend
- **Prettier**: Code formatting (optional)

### Testing
```bash
# Add testing framework
npm install --save-dev jest @testing-library/react

# Run tests
npm test
```

## 🛡️ Security Considerations

### Production Security
1. **Environment Variables**: Never commit sensitive data
2. **JWT Secret**: Use a strong, random secret
3. **Rate Limiting**: Implement appropriate limits
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure proper CORS origins
6. **Input Validation**: Validate all user inputs

### Best Practices
- Regular security audits
- Dependency updates
- Proper error handling
- Logging and monitoring
- Database security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow the existing code style
- Add appropriate comments
- Update documentation
- Test your changes
- Use meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [DummyJSON](https://dummyjson.com/) - Sample data API
- [Recharts](https://recharts.org/) - Chart library

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the API endpoints
- Verify your configuration

## 🔄 Roadmap

Future enhancements:
- [ ] User roles and permissions
- [ ] Advanced filtering options
- [ ] Export functionality
- [ ] Dark mode support
- [ ] Mobile app version
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support

---

**Built with ❤️ for the Dashboard Application Assignment**
