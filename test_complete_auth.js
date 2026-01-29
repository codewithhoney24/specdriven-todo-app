// Comprehensive test to check the entire auth flow
const axios = require('axios');

async function testCompleteAuthFlow() {
  try {
    console.log('=== Testing Complete Auth Flow ===');
    
    // Step 1: Login
    console.log('\n1. Testing login...');
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', loginResponse.data);
    
    if (loginResponse.status !== 200) {
      console.log('LOGIN FAILED - This is the issue!');
      return;
    }
    
    const token = loginResponse.data.access_token;
    console.log('Received token:', token);
    
    // Step 2: Decode token (similar to frontend logic)
    console.log('\n2. Testing token decoding...');
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log('ERROR: Invalid token format');
      return;
    }
    
    const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const payload = JSON.parse(Buffer.from(paddedBase64, 'base64').toString());
    
    console.log('Decoded payload:', payload);
    
    // Step 3: Create user object (similar to frontend logic)
    console.log('\n3. Creating user object...');
    const user = {
      id: payload.sub,  // Use the subject (sub) field from the token as the user ID
      email: payload.email,
      name: payload.name || 'test@example.com'.split('@')[0] // Use email prefix as name if not in token
    };
    
    console.log('Created user object:', user);
    
    // Step 4: Test getting user profile with the token
    console.log('\n4. Testing get user profile...');
    const profileResponse = await axios.get('http://localhost:8000/api/users/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile Status:', profileResponse.status);
    console.log('Profile Response:', profileResponse.data);
    
    console.log('\n=== All tests passed! Backend is working correctly ===');
  } catch (error) {
    console.error('\n=== ERROR in auth flow ===');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else {
      console.error('Other error:', error);
    }
  }
}

testCompleteAuthFlow();