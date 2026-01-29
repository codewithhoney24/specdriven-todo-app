from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional
from pydantic import BaseModel
from models import Task
from middleware.auth import create_access_token, verify_token
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
import hashlib
from user_storage import get_user, update_user, create_user

# Load environment variables
load_dotenv()

# Initialize router
router = APIRouter()

# Secret key for JWT
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-default-secret-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

class UserRegistration(BaseModel):
    """Request model for user registration."""
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    """Request model for user login."""
    email: str
    password: str

class UserResponse(BaseModel):
    """Response model for user data."""
    id: str
    email: str
    name: str

class TokenResponse(BaseModel):
    """Response model for authentication tokens."""
    access_token: str
    token_type: str

@router.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegistration):
    """
    Register a new user.

    Args:
        user_data: User registration data

    Returns:
        UserResponse: Created user data
    """
    # In a real implementation, you would create the user in the database
    # For now, we'll simulate the creation with a mock ID
    # Using hashlib to ensure consistent user ID generation
    email_hash = hashlib.sha256(user_data.email.encode()).hexdigest()[:16]  # Take first 16 chars
    mock_user_id = f"mock-{user_data.email.split('@')[0]}-{email_hash}"

    # Create user in storage
    create_user(mock_user_id, user_data.name, user_data.email)

    # Create access token
    token_data = {"sub": mock_user_id, "email": user_data.email}
    access_token = create_access_token(data=token_data)

    return UserResponse(
        id=mock_user_id,
        email=user_data.email,
        name=user_data.name
    )

@router.post("/auth/login", response_model=TokenResponse)
def login_user(user_data: UserLogin):
    """
    Authenticate user and return access token.

    Args:
        user_data: User login credentials

    Returns:
        TokenResponse: Authentication token
    """
    # In a real implementation, you would verify the user's credentials against the database
    # For now, we'll simulate successful authentication
    # Using the same consistent method as registration
    email_hash = hashlib.sha256(user_data.email.encode()).hexdigest()[:16]  # Take first 16 chars
    mock_user_id = f"mock-{user_data.email.split('@')[0]}-{email_hash}"

    # Check if user exists in storage, if not create a basic entry
    user_info = get_user(mock_user_id)
    if not user_info:
        create_user(mock_user_id, user_data.email.split('@')[0], user_data.email)

    # Create access token
    token_data = {"sub": mock_user_id, "email": user_data.email}
    access_token = create_access_token(data=token_data)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer"
    )


# User profile endpoints
class UserProfileUpdate(BaseModel):
    """Request model for updating user profile."""
    name: Optional[str] = None
    email: Optional[str] = None


@router.put("/users/me", response_model=UserResponse)
def update_profile(
    user_data: UserProfileUpdate,
    current_user_id: str = Depends(verify_token)
):
    """
    Update the authenticated user's profile.

    Args:
        user_data: User profile update data
        current_user_id: The ID of the authenticated user (from token)

    Returns:
        UserResponse: Updated user data
    """
    # Get the current user data to use as defaults if fields aren't provided
    current_user_info = get_user(current_user_id)
    if not current_user_info:
        # If user doesn't exist in storage, create a basic record
        # Extract email from the token payload to reconstruct user info
        try:
            payload = jwt.decode(current_user_id, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("email") or f"{current_user_id}@example.com"
            name = payload.get("name") or current_user_id.split('-')[1] if '-' in current_user_id else current_user_id
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

        create_user(current_user_id, name, email)
        current_user_info = get_user(current_user_id)

    # Update user in storage, using existing values if new ones aren't provided
    update_user(
        current_user_id,
        name=user_data.name if user_data.name is not None else current_user_info.get("name"),
        email=user_data.email if user_data.email is not None else current_user_info.get("email")
    )

    # Get the updated user data from storage
    user_info = get_user(current_user_id)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Return updated user data
    return UserResponse(
        id=current_user_id,
        email=user_info["email"],
        name=user_info["name"]
    )


@router.get("/users/me", response_model=UserResponse)
def get_profile(
    current_user_id: str = Depends(verify_token)
):
    """
    Get the authenticated user's profile.

    Args:
        current_user_id: The ID of the authenticated user (from token)

    Returns:
        UserResponse: Current user data
    """
    # Get the current user data from storage
    user_info = get_user(current_user_id)
    if not user_info:
        # If user doesn't exist in storage, create a basic record from token
        try:
            payload = jwt.decode(current_user_id, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("email") or f"{current_user_id}@example.com"
            name = payload.get("name") or current_user_id.split('-')[1] if '-' in current_user_id else current_user_id
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

        create_user(current_user_id, name, email)
        user_info = get_user(current_user_id)

    # Return user data
    return UserResponse(
        id=current_user_id,
        email=user_info["email"],
        name=user_info["name"]
    )