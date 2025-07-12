const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  otpEmail: (otp, userEmail) => ({
    subject: '🔐 Your Login Verification Code',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1f2937;
          }
          
          .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          
          .otp-container {
            background: #f8fafc;
            border: 2px dashed #e5e7eb;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
          }
          
          .otp-label {
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 15px;
          }
          
          .otp-code {
            font-size: 36px;
            font-weight: 700;
            color: #1f2937;
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Monaco', 'Menlo', monospace;
          }
          
          .otp-validity {
            font-size: 14px;
            color: #ef4444;
            font-weight: 500;
          }
          
          .security-note {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
          }
          
          .security-note h3 {
            color: #92400e;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .security-note p {
            color: #a16207;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer p {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
          }
          
          .footer .company {
            font-weight: 600;
            color: #1f2937;
          }
          
          @media (max-width: 600px) {
            .container {
              margin: 0 15px;
              border-radius: 8px;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .content {
              padding: 30px 20px;
            }
            
            .otp-code {
              font-size: 28px;
              letter-spacing: 4px;
            }
            
            .footer {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Verification Code</h1>
            <p>Secure access to your dashboard</p>
          </div>
          
          <div class="content">
            <div class="greeting">Hello there! 👋</div>
            
            <div class="message">
              We received a request to sign in to your account. Please use the verification code below to complete your login:
            </div>
            
            <div class="otp-container">
              <div class="otp-label">Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div class="otp-validity">⏰ Valid for 10 minutes</div>
            </div>
            
            <div class="security-note">
              <h3>🛡️ Security Reminder</h3>
              <p>Never share this code with anyone. Our team will never ask for your verification code via phone or email.</p>
            </div>
            
            <div class="message">
              If you didn't request this code, please ignore this email or contact our support team if you have concerns.
            </div>
          </div>
          
          <div class="footer">
            <p class="company">Dashboard App</p>
            <p>This is an automated message, please do not reply.</p>
            <p>© 2025 Dashboard App. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  confirmationEmail: (userEmail) => ({
    subject: '✅ Login Successful - Welcome to Dashboard!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Successful</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .success-icon {
            text-align: center;
            font-size: 64px;
            margin-bottom: 20px;
          }
          
          .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1f2937;
            text-align: center;
          }
          
          .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
            line-height: 1.7;
            text-align: center;
          }
          
          .features {
            background: #f8fafc;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
          }
          
          .features h3 {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
          }
          
          .feature-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          
          .feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
          }
          
          .feature-icon {
            font-size: 20px;
            width: 24px;
            text-align: center;
          }
          
          .feature-text {
            font-size: 14px;
            color: #374151;
            font-weight: 500;
          }
          
          .cta-button {
            display: block;
            width: fit-content;
            margin: 30px auto;
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
          }
          
          .cta-button:hover {
            transform: translateY(-2px);
          }
          
          .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer p {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
          }
          
          .footer .company {
            font-weight: 600;
            color: #1f2937;
          }
          
          @media (max-width: 600px) {
            .container {
              margin: 0 15px;
              border-radius: 8px;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .content {
              padding: 30px 20px;
            }
            
            .features {
              padding: 20px;
            }
            
            .footer {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Login Successful!</h1>
            <p>Welcome to your dashboard</p>
          </div>
          
          <div class="content">
            <div class="success-icon">🎉</div>
            
            <div class="greeting">Welcome back!</div>
            
            <div class="message">
              You have successfully logged in to your dashboard. Your account is now active and ready to use.
            </div>
            
            <div class="features">
              <h3>🚀 What's Available</h3>
              <div class="feature-list">
                <div class="feature-item">
                  <div class="feature-icon">📊</div>
                  <div class="feature-text">View comprehensive product analytics</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">📦</div>
                  <div class="feature-text">Browse and manage product catalog</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">📈</div>
                  <div class="feature-text">Track performance metrics</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">⚡</div>
                  <div class="feature-text">Real-time data updates</div>
                </div>
              </div>
            </div>
            
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="cta-button">
              🎯 Go to Dashboard
            </a>
            
            <div class="message">
              If you have any questions or need assistance, don't hesitate to reach out to our support team.
            </div>
          </div>
          
          <div class="footer">
            <p class="company">Dashboard App</p>
            <p>This is an automated message, please do not reply.</p>
            <p>© 2025 Dashboard App. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();
  const template = emailTemplates.otpEmail(otp, email);
  
  const mailOptions = {
    from: `"Dashboard App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: template.subject,
    html: template.html
  };
  
  return await transporter.sendMail(mailOptions);
};

// Send confirmation email
const sendConfirmationEmail = async (email) => {
  const transporter = createTransporter();
  const template = emailTemplates.confirmationEmail(email);
  
  const mailOptions = {
    from: `"Dashboard App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: template.subject,
    html: template.html
  };
  
  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
  sendConfirmationEmail
};
