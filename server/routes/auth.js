const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Joi = require('joi');
const User = require('../models/User');
const { sendOTPEmail, sendConfirmationEmail } = require('../services/emailService');

const router = express.Router();

// Validation schemas
const emailSchema = Joi.object({
  email: Joi.string().email().required()
});

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
});

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable. Please check MongoDB configuration.',
        hint: 'Check MONGODB_IP_FIX.md for setup instructions'
      });
    }

    // Validate request
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email } = req.body;

    // Check if user exists, if not create new user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    // Check if user has exceeded OTP attempts
    if (user.otp.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP attempts. Please try again later.'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otp.code = otp;
    user.otp.expiresAt = expiresAt;
    user.otp.attempts = user.otp.attempts + 1;

    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      
      res.json({
        success: true,
        message: 'OTP sent successfully to your email',
        data: {
          email,
          expiresAt,
          canResend: false
        }
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable. Please check MongoDB configuration.',
        hint: 'Check MONGODB_IP_FIX.md for setup instructions'
      });
    }

    // Validate request
    const { error } = otpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.otp.code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check if OTP is expired
    if (user.isOTPExpired()) {
      user.clearOTP();
      await user.save();
      
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    const isValidOTP = await user.compareOTP(otp);
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // OTP is valid, update user
    user.isEmailVerified = true;
    user.lastLogin = new Date();
    user.clearOTP();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Send confirmation email
    try {
      await sendConfirmationEmail(email);
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
      // Don't fail the request if confirmation email fails
    }

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable. Please check MongoDB configuration.',
        hint: 'Check MONGODB_IP_FIX.md for setup instructions'
      });
    }

    // Validate request
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has exceeded OTP attempts
    if (user.otp.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP attempts. Please try again later.'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otp.code = otp;
    user.otp.expiresAt = expiresAt;
    user.otp.attempts = user.otp.attempts + 1;

    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      
      res.json({
        success: true,
        message: 'OTP resent successfully',
        data: {
          email,
          expiresAt,
          canResend: false
        }
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to resend OTP email. Please try again.'
      });
    }

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/demo-login (for testing without MongoDB)
router.post('/demo-login', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate a demo token for testing
    const token = jwt.sign({ 
      userId: 'demo-user-id',
      email: email,
      demo: true 
    }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      message: 'Demo login successful',
      data: {
        token,
        user: {
          id: 'demo-user-id',
          email: email,
          isEmailVerified: true,
          lastLogin: new Date(),
          demo: true
        }
      }
    });

  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
