# User Authentication - Hackathon Todo Phase II
*Reference: SP.Constitution sections 2.1, 2.2, 5, 9*

## Overview
This specification defines the user authentication system for the Hackathon Phase II Todo Application. The system uses Better Auth with JWT tokens to provide secure user registration, login, and session management with proper user isolation.

## User Stories
- As a visitor, I want to sign up for an account, so that I can use the todo application
- As a registered user, I want to log in to my account, so that I can access my tasks
- As a logged-in user, I want to log out of my account, so that I can end my session securely

## Acceptance Criteria
- [ ] Users can register with email and password
- [ ] Users can log in with registered credentials
- [ ] Users can log out to end their session
- [ ] Authentication is required for all task operations
- [ ] JWT tokens are properly validated on backend
- [ ] User data is isolated by user_id
- [ ] Tokens expire after 7 days
- [ ] Secure token storage is implemented

## Technical Requirements

### Frontend
- Better Auth client-side setup
- Signup page with email and password fields
- Login page with email and password fields
- Logout functionality
- Automatic token inclusion in API requests
- Protected routes that redirect to login when not authenticated
- Session state management

### Backend
- Better Auth server-side configuration
- JWT token validation middleware
- User_id extraction from JWT payload
- User_id verification against URL parameters
- Proper error responses for authentication failures
- Secure token signing with strong secret

### Database
- User accounts managed by Better Auth
- Proper indexing on user identifiers
- Secure password storage (handled by Better Auth)

## Better Auth Configuration
```javascript
// frontend/lib/auth.ts
import { createAuth } from "better-auth/react";
import { bearer } from "better-auth/client/plugins";

export const auth = createAuth({
  plugins: [bearer()]
});
```

## JWT Token Flow
1. User registers/logins through Better Auth client
2. Better Auth creates JWT token with user identity
3. Token is securely stored (preferably httpOnly cookie)
4. Frontend includes token in Authorization header for API calls
5. Backend verifies JWT signature using shared secret
6. Backend extracts user_id from token payload
7. Backend validates user_id matches URL parameter
8. Backend filters all queries by authenticated user_id

## Frontend Better Auth Setup
```javascript
// frontend/components/AuthProvider.tsx
"use client";
import { auth } from "@/lib/auth";
import { AuthProvider as BetterAuthProvider } from "better-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <BetterAuthProvider client={auth}>
      {children}
    </BetterAuthProvider>
  );
}
```

## Backend JWT Verification
```python
# backend/middleware/auth.py
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from pydantic import BaseModel

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

## Protected Routes Implementation
```python
# backend/routes/tasks.py
from fastapi import APIRouter, Depends
from .middleware.auth import verify_token

router = APIRouter()

@router.get("/api/{user_id}/tasks")
async def get_tasks(user_id: str, current_user_id: str = Depends(verify_token)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    # Return user's tasks
```

## Environment Variables
- `BETTER_AUTH_SECRET`: Minimum 32-character secret for JWT signing
- `BETTER_AUTH_URL`: Application URL for redirects
- `NEXT_PUBLIC_API_URL`: Frontend API base URL
- `JWT_ALGORITHM`: Algorithm for token signing (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time (default: 10080 for 7 days)

## Security Requirements
- JWT tokens must expire after 7 days
- BETTER_AUTH_SECRET must be at least 32 characters
- Same secret used in both frontend and backend
- All API endpoints require valid JWT except auth endpoints
- User_id in URL must match user_id in JWT token
- HTTPS required in production
- CORS restricted to known origins
- No sensitive data in JWT payload
- Database connections use SSL (sslmode=require)

## Error Handling
- 401: Missing or invalid JWT token
- 403: User_id mismatch between token and URL
- 500: Server-side authentication error

## Testing Checklist
- [ ] User can successfully register with valid credentials
- [ ] Registration with existing email fails appropriately
- [ ] User can successfully log in with correct credentials
- [ ] Login with incorrect credentials fails with 401
- [ ] User can log out and lose access to protected resources
- [ ] API requests without token return 401
- [ ] API requests with invalid token return 401
- [ ] API requests with valid token for wrong user return 403
- [ ] User isolation is maintained across all operations
- [ ] JWT tokens expire after configured time

*Last Updated: 2026-01-24*
*Status: Ready*