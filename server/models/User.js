const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: {
      type: String,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    },
    attempts: {
      type: Number,
      default: 0
    }
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash OTP before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('otp.code') || !this.otp.code) return next();
  
  this.otp.code = await bcrypt.hash(this.otp.code, 12);
  next();
});

// Compare OTP method
userSchema.methods.compareOTP = async function(candidateOTP) {
  if (!this.otp.code) return false;
  return await bcrypt.compare(candidateOTP, this.otp.code);
};

// Check if OTP is expired
userSchema.methods.isOTPExpired = function() {
  if (!this.otp.expiresAt) return true;
  return Date.now() > this.otp.expiresAt;
};

// Clear OTP method
userSchema.methods.clearOTP = function() {
  this.otp.code = null;
  this.otp.expiresAt = null;
  this.otp.attempts = 0;
};

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
