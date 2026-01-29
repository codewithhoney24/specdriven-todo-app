# API Contract: Todo Application

**Feature**: Todo Application  
**Date**: 2026-01-24  
**Contract Version**: 1.0

## Overview
API contract for the todo application backend services, following SP.Constitution API standards.

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `[TO BE DEFINED]`

## Authentication
All endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

*Following SP.Constitution section 5.1: JWT token validation required for all protected endpoints*

## Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

**Response (201)**:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response (200)**:
```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

### Task Management Endpoints

#### GET /api/{user_id}/tasks
Retrieve all tasks for the specified user.

**Headers**:
- `Authorization: Bearer <token>`

**Response (200)**:
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

#### POST /api/{user_id}/tasks
Create a new task for the specified user.

**Headers**:
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "title": "New task title",
  "description": "Task description (optional)"
}
```

**Response (201)**:
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

#### GET /api/{user_id}/tasks/{id}
Retrieve a specific task for the specified user.

**Headers**:
- `Authorization: Bearer <token>`

**Response (200)**:
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

#### PUT /api/{user_id}/tasks/{id}
Update an existing task for the specified user.

**Headers**:
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true
}
```

**Response (200)**:
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

#### DELETE /api/{user_id}/tasks/{id}
Delete a specific task for the specified user.

**Headers**:
- `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "message": "Task deleted successfully"
}
```

#### PATCH /api/{user_id}/tasks/{id}/complete
Toggle the completion status of a specific task for the specified user.

**Headers**:
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "completed": true
}
```

**Response (200)**:
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

## Error Responses
All error responses follow the format:
```json
{
  "detail": "Descriptive error message"
}
```

*Following SP.Constitution section 6.2: Consistent error response format*

## Status Codes
- 200: Success (GET, PUT, PATCH, DELETE)
- 201: Created (POST)
- 400: Bad Request (invalid input data)
- 401: Unauthorized (missing or invalid JWT token)
- 403: Forbidden (user trying to access another user's data)
- 404: Not Found (requested resource doesn't exist)
- 500: Internal Server Error (unexpected server error)

*Following SP.Constitution section 6.3: Standard HTTP status codes*