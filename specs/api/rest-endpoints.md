# REST API Endpoints - Hackathon Todo Phase II
*Reference: SP.Constitution sections 2.2, 6, 9*

## Overview
This specification defines all REST API endpoints for the Hackathon Phase II Todo Application. The API follows REST conventions with proper authentication, error handling, and response formats.

## Base URLs
- **Development**: `http://localhost:8000`
- **Production**: `[TO BE DEFINED]`

## Authentication Requirements
All endpoints except authentication endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Endpoint Specifications

### GET /api/{user_id}/tasks
Retrieve all tasks for the specified user.

**Method**: GET  
**URL Pattern**: `/api/{user_id}/tasks`  
**Authentication**: Required (valid JWT token)  
**Query Parameters**:
- `status`: Filter by completion status (optional: "all", "active", "completed"; default: "all")
- `sort`: Sort order (optional: "created", "updated", "title"; default: "created")

**Request Headers**:
- `Authorization: Bearer <token>`

**Response Format (Success)**:
```json
[
  {
    "id": 1,
    "user_id": "user-uuid",
    "title": "Sample task",
    "description": "Task description",
    "completed": false,
    "created_at": "2024-01-24T10:00:00Z",
    "updated_at": "2024-01-24T10:00:00Z"
  }
]
```

**Response Format (Error)**:
```json
{
  "detail": "Error message"
}
```

**Status Codes**:
- 200: Success - Tasks retrieved
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - User_id in token doesn't match URL parameter
- 500: Internal Server Error

### POST /api/{user_id}/tasks
Create a new task for the specified user.

**Method**: POST  
**URL Pattern**: `/api/{user_id}/tasks`  
**Authentication**: Required (valid JWT token)  

**Request Body**:
```json
{
  "title": "New task title",
  "description": "Task description (optional)"
}
```

**Request Headers**:
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Response Format (Success)**:
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "New task title",
  "description": "Task description (optional)",
  "completed": false,
  "created_at": "2024-01-24T10:00:00Z",
  "updated_at": "2024-01-24T10:00:00Z"
}
```

**Response Format (Error)**:
```json
{
  "detail": "Error message"
}
```

**Status Codes**:
- 201: Created - Task successfully created
- 400: Bad Request - Invalid input data (missing title, etc.)
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - User_id in token doesn't match URL parameter
- 500: Internal Server Error

### GET /api/{user_id}/tasks/{id}
Retrieve a specific task for the specified user.

**Method**: GET  
**URL Pattern**: `/api/{user_id}/tasks/{id}`  
**Authentication**: Required (valid JWT token)  

**Request Headers**:
- `Authorization: Bearer <token>`

**Response Format (Success)**:
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Sample task",
  "description": "Task description",
  "completed": false,
  "created_at": "2024-01-24T10:00:00Z",
  "updated_at": "2024-01-24T10:00:00Z"
}
```

**Response Format (Error)**:
```json
{
  "detail": "Error message"
}
```

**Status Codes**:
- 200: Success - Task retrieved
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - User_id in token doesn't match URL parameter
- 404: Not Found - Task doesn't exist
- 500: Internal Server Error

### PUT /api/{user_id}/tasks/{id}
Update an existing task for the specified user.

**Method**: PUT  
**URL Pattern**: `/api/{user_id}/tasks/{id}`  
**Authentication**: Required (valid JWT token)  

**Request Body**:
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true
}
```

**Request Headers**:
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Response Format (Success)**:
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true,
  "created_at": "2024-01-24T10:00:00Z",
  "updated_at": "2024-01-24T11:00:00Z"
}
```

**Response Format (Error)**:
```json
{
  "detail": "Error message"
}
```

**Status Codes**:
- 200: Success - Task updated
- 400: Bad Request - Invalid input data
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - User_id in token doesn't match URL parameter
- 404: Not Found - Task doesn't exist
- 500: Internal Server Error

### DELETE /api/{user_id}/tasks/{id}
Delete a specific task for the specified user.

**Method**: DELETE  
**URL Pattern**: `/api/{user_id}/tasks/{id}`  
**Authentication**: Required (valid JWT token)  

**Request Headers**:
- `Authorization: Bearer <token>`

**Response Format (Success)**:
```json
{
  "message": "Task deleted successfully"
}
```

**Response Format (Error)**:
```json
{
  "detail": "Error message"
}
```

**Status Codes**:
- 200: Success - Task deleted
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - User_id in token doesn't match URL parameter
- 404: Not Found - Task doesn't exist
- 500: Internal Server Error

### PATCH /api/{user_id}/tasks/{id}/complete
Toggle the completion status of a specific task for the specified user.

**Method**: PATCH  
**URL Pattern**: `/api/{user_id}/tasks/{id}/complete`  
**Authentication**: Required (valid JWT token)  

**Request Body**:
```json
{
  "completed": true
}
```

**Request Headers**:
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Response Format (Success)**:
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Sample task",
  "description": "Task description",
  "completed": true,
  "created_at": "2024-01-24T10:00:00Z",
  "updated_at": "2024-01-24T11:00:00Z"
}
```

**Response Format (Error)**:
```json
{
  "detail": "Error message"
}
```

**Status Codes**:
- 200: Success - Task completion status updated
- 400: Bad Request - Invalid input data (completed field missing or invalid)
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - User_id in token doesn't match URL parameter
- 404: Not Found - Task doesn't exist
- 500: Internal Server Error

## Error Response Format
All error responses follow the same format:
```json
{
  "detail": "Descriptive error message"
}
```

## HTTP Status Codes Reference
| Code | Meaning | Context |
|------|---------|---------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected server error |

## CORS Configuration
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Additional security: expose only necessary headers
    expose_headers=["Access-Control-Allow-Origin"]
)
```

## Security Considerations
- All endpoints except auth endpoints require JWT authentication
- User_id in URL must match user_id in JWT token
- Input validation on all request bodies
- Proper error responses without sensitive information leakage
- HTTPS required in production

*Last Updated: 2026-01-24*
*Status: Ready*