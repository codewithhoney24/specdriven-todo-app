# Claude Code Context: Todo Application Backend

## Project Overview

This is the backend for a full-stack Todo Application built with FastAPI and SQLModel. The application provides a RESTful API for task management with JWT-based authentication and user data isolation.

## Tech Stack

- Python 3.13+
- FastAPI
- SQLModel (SQLAlchemy + Pydantic)
- Python-JOSE (for JWT)
- Uvicorn (ASGI server)

## Key Components

- `main.py` - FastAPI app initialization with CORS middleware
- `models.py` - SQLModel database models (Task model)
- `db.py` - Database connection and session management
- `routes/` - API route handlers
  - `auth.py` - Authentication endpoints (register, login)
  - `tasks.py` - Task management endpoints (CRUD operations)
- `middleware/` - Middleware components
  - `auth.py` - JWT authentication middleware
- `services/` - Business logic
  - `auth_service.py` - Authentication service
  - `task_service.py` - Task management service
- `requirements.txt` - Python dependencies

## Authentication

The application uses JWT tokens for authentication. The middleware in `middleware/auth.py` verifies tokens and extracts user information. All protected endpoints require a valid JWT token.

## Database

The application uses SQLModel for database modeling. The Task model is defined in `models.py` with proper relationships and constraints. Database connections are managed in `db.py`.

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with existing credentials
- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task for a user
- `GET /api/{user_id}/tasks/{task_id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle task completion

## Security

- JWT-based authentication for all protected endpoints
- User data isolation (users can only access their own tasks)
- Input validation using Pydantic models
- Environment variables for sensitive configuration

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string with sslmode=require
- `BETTER_AUTH_SECRET`: Secret key for JWT signing (minimum 32 characters)
- `JWT_ALGORITHM`: Algorithm for JWT signing (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes (default: 10080 for 7 days)

## Key Features

1. RESTful API design with standard HTTP methods
2. JWT-based authentication with token validation
3. User data isolation with user_id filtering
4. Comprehensive CRUD operations for tasks
5. Task completion status management
6. Input validation and error handling