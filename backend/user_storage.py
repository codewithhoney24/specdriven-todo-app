"""
Simple in-memory user storage for demo purposes.
In a real application, this would be replaced with a database.
"""

# Simple in-memory storage for user data
user_data_store = {}

def get_user(user_id: str):
    """Get user data by user ID."""
    return user_data_store.get(user_id)

def update_user(user_id: str, name: str = None, email: str = None):
    """Update user data."""
    if user_id not in user_data_store:
        # Create a new user record if it doesn't exist
        user_data_store[user_id] = {
            "id": user_id,
            "name": name,
            "email": email
        }
    else:
        # Update existing user record
        if name is not None:
            user_data_store[user_id]["name"] = name
        if email is not None:
            user_data_store[user_id]["email"] = email

def create_user(user_id: str, name: str, email: str):
    """Create a new user record."""
    user_data_store[user_id] = {
        "id": user_id,
        "name": name,
        "email": email
    }