# Todo Application Backend

This is the backend for the Todo Application, built with FastAPI and SQLModel.

## Features

- RESTful API endpoints for task management
- JWT-based authentication
- User data isolation
- CRUD operations for tasks
- Secure API with proper validation

## Tech Stack

- Python 3.13+
- FastAPI
- SQLModel (SQLAlchemy + Pydantic)
- Python-JOSE (for JWT)
- Uvicorn (ASGI server)

## Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with the following environment variables:
   ```env
   DATABASE_URL=postgresql://user:pass@host:port/dbname?sslmode=require
   BETTER_AUTH_SECRET=your-32-characters-long-secret-here
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
   ```

4. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string with sslmode=require
- `BETTER_AUTH_SECRET`: Secret key for JWT signing (minimum 32 characters)
- `JWT_ALGORITHM`: Algorithm for JWT signing (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes (default: 10080 for 7 days)

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with existing credentials
- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task for a user
- `GET /api/{user_id}/tasks/{task_id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle task completion

## Project Structure

```
backend/
├── main.py              # FastAPI app initialization
├── models.py            # SQLModel database models
├── db.py                # Database connection and session management
├── routes/              # API route handlers
│   ├── auth.py          # Authentication endpoints
│   └── tasks.py         # Task management endpoints
├── middleware/          # Middleware (auth, etc.)
│   └── auth.py          # JWT authentication middleware
├── services/            # Business logic
│   ├── auth_service.py  # Authentication service
│   └── task_service.py  # Task management service
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables (not committed)
```