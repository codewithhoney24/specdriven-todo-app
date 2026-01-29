import requests
import json

# Test the API endpoints manually to understand the issue

print("Testing API endpoints...")

# First, let's try to get the current user to see what user ID we're working with
print("\n1. Testing /api/users/me endpoint:")
headers = {
    "Authorization": "Bearer YOUR_TOKEN_HERE",  # Replace with actual token
    "Content-Type": "application/json"
}

# Commenting out the actual call since we don't have a valid token
# response = requests.get("http://localhost:8000/api/users/me", headers=headers)
# print(f"Response: {response.status_code} - {response.text}")

print("\n2. Understanding the user ID generation:")
print("From the logs, we can see a user ID like: mock-onlinework42101-3692d07114fb3d3b")
print("This follows the pattern: mock-{email_prefix}-{hash}")

print("\n3. The issue:")
print("- User registers and gets a token with a specific user ID")
print("- When fetching tasks, the frontend extracts user ID from token")
print("- Then makes request to /api/{extracted_user_id}/tasks")
print("- Backend verifies that URL user ID matches token user ID")
print("- If there's any mismatch, it returns 403 Forbidden")

print("\n4. Potential causes:")
print("- Different user ID generation between registration/login and token creation")
print("- Timing issue where old token is being used")
print("- Issue with token refresh after registration")

print("\n5. Solution approach:")
print("- Make sure the user ID in the token matches exactly what's expected by the backend")
print("- Verify that after registration, the newly created token is being used")
print("- Check that user ID generation is consistent between auth and tasks modules")