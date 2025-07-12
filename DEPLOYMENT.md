# 🚀 Deployment Guide

This guide will help you deploy your Dashboard Application to production.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB database configured
- [ ] Email service configured
- [ ] Environment variables set
- [ ] Frontend and backend tested locally
- [ ] Domain names chosen (optional)

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Your Frontend

```bash
# Ensure your frontend builds successfully
npm run build
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from root directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: dashboard-app
# - Directory: ./
# - Want to override settings? No
```

**Option B: Using GitHub Integration**
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings (usually auto-detected)

### 3. Configure Environment Variables

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### 4. Deploy Updates

```bash
# For CLI deployments
vercel --prod

# For GitHub integration, just push to main branch
git push origin main
```

---

## 🖥️ Backend Deployment (Railway)

### 1. Prepare Your Backend

```bash
cd server
npm install
```

### 2. Deploy to Railway

**Option A: Using Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

**Option B: Using GitHub Integration**
1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Select the `server` directory as root

### 3. Configure Environment Variables

In your Railway dashboard:
1. Go to your project
2. Navigate to "Variables"
3. Add the following variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dashboard-app
JWT_SECRET=your-super-secure-secret-key-for-production
FRONTEND_URL=https://your-vercel-app.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Custom Domain (Optional)

1. In Railway dashboard, go to "Settings"
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for free account
3. Create new cluster (choose free tier)

### 2. Configure Database Access

1. Go to "Database Access"
2. Add database user with read/write permissions
3. Go to "Network Access"
4. Add IP address (0.0.0.0/0 for all IPs or specific IPs)

### 3. Get Connection String

1. Go to "Clusters"
2. Click "Connect"
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database user password

### 4. Create Database

```javascript
// The database will be created automatically when you first connect
// Database name: dashboard-app
// Collection: users (created automatically)
```

---

## 📧 Email Service Setup

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification

2. **Generate App Password**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Use this password in your `SMTP_PASS` environment variable

3. **Configure Environment Variables**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-generated-app-password
   ```

### Alternative Email Services

**SendGrid**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun**
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

---

## 🔐 Security Configuration

### 1. JWT Secret

Generate a secure JWT secret:
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. CORS Configuration

Update your backend to allow your frontend domain:
```javascript
// In your backend index.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

### 3. Environment Variables Security

- Never commit `.env` files to version control
- Use different secrets for development and production
- Regularly rotate secrets and passwords
- Use strong, unique passwords

---

## 🔄 Alternative Deployment Options

### Frontend Alternatives

**Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
netlify deploy --prod
```

**GitHub Pages**
```bash
# Install gh-pages
npm i -g gh-pages

# Deploy
npm run build
gh-pages -d out
```

### Backend Alternatives

**Heroku**
```bash
# Install Heroku CLI
npm i -g heroku

# Create app
heroku create your-app-name

# Deploy
git push heroku main
```

**DigitalOcean App Platform**
1. Connect GitHub repository
2. Choose branch
3. Configure build settings
4. Deploy

**Render**
1. Connect GitHub repository
2. Choose Web Service
3. Configure environment variables
4. Deploy

---

## 🌐 Custom Domain Setup

### Frontend Domain (Vercel)

1. **Add Domain to Vercel**
   - Go to project settings
   - Add domain in "Domains" section

2. **Configure DNS**
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.19.61`

### Backend Domain (Railway)

1. **Add Domain to Railway**
   - Go to project settings
   - Add domain in "Domains" section

2. **Configure DNS**
   - Add CNAME record: `api` → `your-project.railway.app`

---

## 📊 Monitoring & Maintenance

### Performance Monitoring

**Frontend (Vercel)**
- Built-in analytics available
- Core Web Vitals monitoring
- Function logs and metrics

**Backend (Railway)**
- Built-in metrics dashboard
- CPU and memory usage
- Request logs and error tracking

### Health Checks

Set up monitoring for:
- API endpoint health: `https://your-backend.com/api/health`
- Database connectivity
- Email service availability

### Backup Strategy

1. **Database Backups**
   - MongoDB Atlas automatic backups
   - Regular manual exports

2. **Code Backups**
   - GitHub repository
   - Tagged releases

---

## 🚨 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
npm run build
# Check for TypeScript errors
npm run lint
```

**Database Connection Issues**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Test connection locally

**Email Issues**
- Verify SMTP credentials
- Check email service status
- Test with different email providers

**CORS Issues**
- Verify frontend URL in backend CORS config
- Check environment variables
- Test with development URLs first

### Debugging Steps

1. **Check Logs**
   - Vercel: Function logs in dashboard
   - Railway: Real-time logs in dashboard

2. **Test Endpoints**
   ```bash
   # Test backend health
   curl https://your-backend.com/api/health
   
   # Test authentication
   curl -X POST https://your-backend.com/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

3. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure proper formatting

---

## 🎯 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API responds to health check
- [ ] Database connection established
- [ ] Email OTP sending works
- [ ] User authentication flow complete
- [ ] Dashboard displays product data
- [ ] Analytics charts render correctly
- [ ] Responsive design works on mobile
- [ ] All environment variables configured
- [ ] Custom domains configured (if applicable)
- [ ] SSL certificates active
- [ ] Error monitoring set up

---

## 📞 Support & Resources

### Documentation Links
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Community Support
- [Vercel Discord](https://vercel.com/discord)
- [Railway Discord](https://discord.gg/railway)
- [Stack Overflow](https://stackoverflow.com)

### Professional Support
- Consider upgrading to paid plans for production applications
- Set up proper monitoring and alerting
- Implement proper backup strategies

---

**🎉 Congratulations! Your Dashboard Application is now live!**

Share your deployment URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.railway.app`
