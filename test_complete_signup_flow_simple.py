import requests
import json

print("Testing complete signup flow...")

# Step 1: Register a new user
print("\n1. Testing registration...")
register_url = "http://localhost:8000/api/auth/register"
headers = {
    "Content-Type": "application/json"
}
register_data = {
    "email": "testuser@example.com",
    "password": "securepassword123",
    "name": "Test User"
}

try:
    register_response = requests.post(register_url, headers=headers, data=json.dumps(register_data))
    print(f"   Registration Status Code: {register_response.status_code}")
    
    if register_response.status_code == 201:
        print("   SUCCESS: Registration successful!")
        user_data = register_response.json()
        print(f"   User ID: {user_data['id']}")
        print(f"   Email: {user_data['email']}")
        print(f"   Name: {user_data['name']}")
        
        # Step 2: Login with the registered user
        print("\n2. Testing login with registered user...")
        login_url = "http://localhost:8000/api/auth/login"
        login_data = {
            "email": "testuser@example.com",
            "password": "securepassword123"
        }
        
        login_response = requests.post(login_url, headers=headers, data=json.dumps(login_data))
        print(f"   Login Status Code: {login_response.status_code}")
        
        if login_response.status_code == 200:
            print("   SUCCESS: Login successful!")
            token_data = login_response.json()
            print(f"   Token Type: {token_data['token_type']}")
            
            # Step 3: Get user profile using the token
            print("\n3. Testing get user profile...")
            profile_url = "http://localhost:8000/api/users/me"
            profile_headers = {
                "Authorization": f"Bearer {token_data['access_token']}",
                "Content-Type": "application/json"
            }
            
            profile_response = requests.get(profile_url, headers=profile_headers)
            print(f"   Profile Status Code: {profile_response.status_code}")
            
            if profile_response.status_code == 200:
                print("   SUCCESS: Get profile successful!")
                profile_data = profile_response.json()
                print(f"   User ID: {profile_data['id']}")
                print(f"   Email: {profile_data['email']}")
                print(f"   Name: {profile_data['name']}")
                
                print("\nAll signup flow tests passed! The registration, login, and profile retrieval are working correctly.")
            else:
                print(f"   ERROR: Failed to get user profile: {profile_response.text}")
        else:
            print(f"   ERROR: Login failed: {login_response.text}")
    else:
        print(f"   ERROR: Registration failed: {register_response.text}")
        
except Exception as e:
    print(f"   ERROR: Error during signup flow: {e}")