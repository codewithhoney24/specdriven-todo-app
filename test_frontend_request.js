// Test script to mimic frontend request exactly
const axios = require('axios');

async function testFrontendLikeRequest() {
  try {
    console.log('Making request similar to frontend...');
    
    // Making a request exactly like the frontend would
    const response = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Add headers that might be sent by the browser
        'Accept': 'application/json',
      },
      // Include credentials if needed
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);
    
    // Now let's manually decode the JWT to see if there's an issue with the token
    const token = response.data.access_token;
    const tokenParts = token.split('.');
    
    if (tokenParts.length === 3) {
      const base64Payload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64Payload.padEnd(base64Payload.length + (4 - base64Payload.length % 4) % 4, '=');
      const payload = JSON.parse(Buffer.from(paddedBase64, 'base64').toString());
      console.log('Decoded token payload:', payload);
    } else {
      console.log('Invalid token format');
    }
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    console.error('Status code:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

testFrontendLikeRequest();