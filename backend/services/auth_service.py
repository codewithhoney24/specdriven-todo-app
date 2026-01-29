"""
Authentication service module for the Todo Application.

This module provides functions for user authentication and authorization
including registration, login, and token management.
"""

from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Get secret key and algorithm from environment variables
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-default-secret-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days default

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to compare against
        
    Returns:
        bool: True if passwords match, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Generate a hash for a plain password.
    
    Args:
        password: Plain text password to hash
        
    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a new access token.
    
    Args:
        data: Data to encode in the token
        expires_delta: Expiration time delta (optional)
        
    Returns:
        str: Encoded JWT token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """
    Verify a JWT token and return the payload if valid.
    
    Args:
        token: JWT token to verify
        
    Returns:
        dict: Token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def authenticate_user(username: str, password: str) -> Optional[dict]:
    """
    Authenticate a user by username and password.
    
    Note: This is a simplified implementation. In a real application,
    you would look up the user in the database and verify the password.
    
    Args:
        username: Username or email of the user
        password: Plain text password
        
    Returns:
        dict: User data if authentication successful, None otherwise
    """
    # In a real implementation, you would:
    # 1. Look up the user in the database by username/email
    # 2. Verify the password using verify_password()
    # 3. Return user data if successful
    
    # For this example, we'll simulate successful authentication
    # with mock user data
    if username and password:  # Simplified check
        return {
            "id": f"mock-{username.split('@')[0]}-{hash(username)}",
            "email": username,
            "name": username.split('@')[0],
            "created_at": datetime.utcnow().isoformat()
        }
    
    return None