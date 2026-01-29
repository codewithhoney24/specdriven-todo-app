"""
API Endpoints Testing Script

This script tests all the API endpoints to ensure they are working correctly.
"""

import requests
import json
import time

# Base URL for the API
BASE_URL = "http://localhost:8000/api"

# Test user credentials
TEST_USER = {
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
}

# Global variables to store test data
auth_token = None
user_id = None
task_id = None

def test_register_endpoint():
    """Test the user registration endpoint."""
    print("Testing Registration Endpoint...")
    url = f"{BASE_URL}/auth/register"
    
    response = requests.post(url, json=TEST_USER)
    
    if response.status_code == 201:
        print(f"✓ Registration successful: {response.status_code}")
        user_data = response.json()
        print(f"  User ID: {user_data.get('id')}")
        return user_data
    else:
        print(f"✗ Registration failed: {response.status_code}")
        print(f"  Response: {response.text}")
        return None

def test_login_endpoint():
    """Test the user login endpoint."""
    print("\nTesting Login Endpoint...")
    url = f"{BASE_URL}/auth/login"
    
    login_data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    }
    
    response = requests.post(url, json=login_data)
    
    if response.status_code == 200:
        print(f"✓ Login successful: {response.status_code}")
        token_data = response.json()
        print(f"  Token type: {token_data.get('token_type')}")
        return token_data
    else:
        print(f"✗ Login failed: {response.status_code}")
        print(f"  Response: {response.text}")
        return None

def test_get_tasks_endpoint():
    """Test getting all tasks for a user."""
    print(f"\nTesting Get Tasks Endpoint for user: {user_id}...")
    url = f"{BASE_URL}/{user_id}/tasks"
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        print(f"✓ Get tasks successful: {response.status_code}")
        tasks = response.json()
        print(f"  Number of tasks: {len(tasks)}")
        return tasks
    else:
        print(f"✗ Get tasks failed: {response.status_code}")
        print(f"  Response: {response.text}")
        return []

def test_create_task_endpoint():
    """Test creating a new task."""
    print(f"\nTesting Create Task Endpoint for user: {user_id}...")
    url = f"{BASE_URL}/{user_id}/tasks"
    
    task_data = {
        "title": "Test Task from API Test",
        "description": "This is a test task created via API test",
        "completed": False,
        "priority": "medium",
        "category": "testing"
    }
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.post(url, json=task_data, headers=headers)
    
    if response.status_code == 201:
        print(f"✓ Create task successful: {response.status_code}")
        task = response.json()
        print(f"  Task ID: {task.get('id')}")
        print(f"  Title: {task.get('title')}")
        return task
    else:
        print(f"✗ Create task failed: {response.status_code}")
        print(f"  Response: {response.text}")
        return None

def test_get_single_task_endpoint(task_id):
    """Test getting a single task."""
    print(f"\nTesting Get Single Task Endpoint for task: {task_id}...")
    url = f"{BASE_URL}/{user_id}/tasks/{task_id}"
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        print(f"✓ Get single task successful: {response.status_code}")
        task = response.json()
        print(f"  Task ID: {task.get('id')}")
        print(f"  Title: {task.get('title')}")
        return task
    else:
        print(f"✗ Get single task failed: {response.status_code}")
        print(f"  Response: {response.text}")
        return None

def test_update_task_endpoint(task_id):
    """Test updating a task."""
    print(f"\nTesting Update Task Endpoint for task: {task_id}...")
    url = f"{BASE_URL}/{user_id}/tasks/{task_id}"
    
    update_data = {
        "title": "Updated Test Task",
        "description": "This task has been updated via API test",
        "priority": "high"
    }
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.put(url, json=update_data, headers=headers)
    
    if response.status_code == 200:
        print(f"✓ Update task successful: {response.status_code}")
        task = response.json()
        print(f"  Task ID: {task.get('id')}")
        print(f"  Updated Title: {task.get('title')}")
        return task
    else:
        print(f"✗ Update task failed: {response.status_code}")
        print(f"  Response: {response.text}")
        return None

def test_toggle_completion_endpoint(task_id):
    """Test toggling task completion status."""
    print(f"\nTesting Toggle Completion Endpoint for task: {task_id}...")
    url = f"{BASE_URL}/{user_id}/tasks/{task_id}/complete"
    
    toggle_data = {"completed": True}
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.patch(url, json=toggle_data, headers=headers)
    
    if response.status_code == 200:
        print(f"✓ Toggle completion successful: {response.status_code}")
        task = response.json()
        print(f"  Task ID: {task.get('id')}")
        print(f"  Completed: {task.get('completed')}")
        return task
    else:
        print(f"✗ Toggle completion failed: {response.status_code}")
        print(f"  Response: {response.text}")
        return None

def test_delete_task_endpoint(task_id):
    """Test deleting a task."""
    print(f"\nTesting Delete Task Endpoint for task: {task_id}...")
    url = f"{BASE_URL}/{user_id}/tasks/{task_id}"
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.delete(url, headers=headers)
    
    if response.status_code == 200:
        print(f"✓ Delete task successful: {response.status_code}")
        result = response.json()
        print(f"  Message: {result.get('message')}")
        return True
    else:
        print(f"✗ Delete task failed: {response.status_code}")
        print(f"  Response: {response.text}")
        return False

def run_tests():
    """Run all endpoint tests."""
    print("Starting API Endpoint Tests...\n")
    
    global auth_token, user_id, task_id
    
    # Step 1: Register user
    user_data = test_register_endpoint()
    if not user_data:
        print("\nCannot proceed without successful registration.")
        return
    
    # Step 2: Login user
    token_data = test_login_endpoint()
    if not token_data:
        print("\nCannot proceed without successful login.")
        return
    
    # Store authentication data
    auth_token = token_data.get("access_token")
    user_id = user_data.get("id")
    
    # Step 3: Get tasks (should be empty initially)
    tasks = test_get_tasks_endpoint()
    
    # Step 4: Create a task
    created_task = test_create_task_endpoint()
    if not created_task:
        print("\nCannot proceed without successful task creation.")
        return
    
    task_id = created_task.get("id")
    
    # Step 5: Get the single task
    test_get_single_task_endpoint(task_id)
    
    # Step 6: Update the task
    test_update_task_endpoint(task_id)
    
    # Step 7: Toggle completion
    test_toggle_completion_endpoint(task_id)
    
    # Step 8: Delete the task
    test_delete_task_endpoint(task_id)
    
    print("\n✓ All endpoint tests completed!")

if __name__ == "__main__":
    run_tests()