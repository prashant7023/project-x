const axios = require('axios');

const testOTP = async () => {
  try {
    console.log('Testing send OTP...');
    const response = await axios.post('https://dashboard-api-6lqa.onrender.com/api/auth/send-otp', {
      email: 'test@example.com'
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
  }
};

testOTP();
