// Test script to debug the login flow
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login to backend...');
    
    const response = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login response:', response.data);
    
    // Now test getting user profile with the token
    const token = response.data.access_token;
    console.log('Testing get user profile with token...');
    
    const profileResponse = await axios.get('http://localhost:8000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile response:', profileResponse.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testLogin();