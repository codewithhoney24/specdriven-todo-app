import requests
import json

# Test the registration endpoint
url = "http://localhost:8000/api/auth/register"
headers = {
    "Content-Type": "application/json"
}
data = {
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
}

try:
    response = requests.post(url, headers=headers, data=json.dumps(data))
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")