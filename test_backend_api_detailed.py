import requests
import json

# Test the backend API endpoints and capture the actual token

print("Testing backend API endpoints...")

# First, let's register a new user to get a fresh token
print("\n1. Registering a new test user...")
register_url = "http://localhost:8000/api/auth/register"
headers = {"Content-Type": "application/json"}
register_data = {
    "email": "testuser2@example.com",
    "password": "password123",
    "name": "Test User 2"
}

try:
    register_response = requests.post(register_url, headers=headers, json=register_data)
    print(f"Registration Response: {register_response.status_code}")
    if register_response.status_code == 201:
        print("Registration successful!")
        user_data = register_response.json()
        print(f"User ID: {user_data['id']}")
        print(f"Email: {user_data['email']}")
        print(f"Name: {user_data['name']}")
    else:
        print(f"Registration failed: {register_response.text}")
        exit(1)
except Exception as e:
    print(f"Registration error: {e}")
    exit(1)

# Now let's login to get a token
print("\n2. Logging in to get a token...")
login_url = "http://localhost:8000/api/auth/login"
login_data = {
    "email": "testuser2@example.com",
    "password": "password123"
}

try:
    login_response = requests.post(login_url, headers=headers, json=login_data)
    print(f"Login Response: {login_response.status_code}")
    if login_response.status_code == 200:
        print("Login successful!")
        token_data = login_response.json()
        token = token_data['access_token']
        print(f"Full Token: {token}")  # Print the full token
        print(f"Token length: {len(token)}")
        
        # Split the token to get the payload part
        parts = token.split('.')
        if len(parts) == 3:
            import base64
            payload_b64 = parts[1]
            # Add padding if necessary
            payload_b64 += '=' * (4 - len(payload_b64) % 4)
            payload_bytes = base64.urlsafe_b64decode(payload_b64)
            payload_str = payload_bytes.decode('utf-8')
            payload = json.loads(payload_str)
            
            print("\nDecoded JWT Payload:")
            print(json.dumps(payload, indent=2))
        else:
            print("Invalid token format")
    else:
        print(f"Login failed: {login_response.text}")
        exit(1)
except Exception as e:
    print(f"Login error: {e}")
    exit(1)

# Now let's try to get the user profile with the token
print("\n3. Getting user profile with token...")
profile_url = "http://localhost:8000/api/users/me"
auth_headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

try:
    profile_response = requests.get(profile_url, headers=auth_headers)
    print(f"Profile Response: {profile_response.status_code}")
    if profile_response.status_code == 200:
        profile_data = profile_response.json()
        print(f"Profile User ID: {profile_data['id']}")
        print(f"Profile Email: {profile_data['email']}")
        print(f"Profile Name: {profile_data['name']}")
    else:
        print(f"Profile request failed: {profile_response.text}")
        exit(1)
except Exception as e:
    print(f"Profile error: {e}")
    exit(1)

# Now let's try to get tasks for this user
print(f"\n4. Getting tasks for user: {profile_data['id']}")
tasks_url = f"http://localhost:8000/api/{profile_data['id']}/tasks"

try:
    tasks_response = requests.get(tasks_url, headers=auth_headers)
    print(f"Tasks Response: {tasks_response.status_code}")
    if tasks_response.status_code == 200:
        tasks_data = tasks_response.json()
        print(f"Number of tasks: {len(tasks_data)}")
        print("Tasks request successful!")
    elif tasks_response.status_code == 403:
        print(f"403 Forbidden error: {tasks_response.text}")
        print("This indicates a mismatch between the user ID in the token and the URL")
    else:
        print(f"Tasks request failed: {tasks_response.text}")
except Exception as e:
    print(f"Tasks error: {e}")