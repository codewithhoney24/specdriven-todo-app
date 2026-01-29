# Quickstart Guide: Todo Application

**Feature**: Todo Application  
**Date**: 2026-01-24  
**Branch**: 002-todo-specs

## Overview
Quickstart guide for setting up and running the full-stack todo application, following SP.Constitution development workflow.

## Prerequisites
- Node.js 18+ for frontend (following SP.Constitution section 2.1)
- Python 3.13+ for backend (following SP.Constitution section 2.2)
- PostgreSQL-compatible database (Neon recommended per SP.Constitution section 2.3)
- Git for version control

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your database URL and auth secret
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your API URL and auth settings
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:port/dbname?sslmode=require
BETTER_AUTH_SECRET=your-32-characters-long-secret-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-32-characters-long-secret-here
BETTER_AUTH_URL=http://localhost:3000
```

*Following SP.Constitution section 9: Environment variables for secrets and configuration*

## Running the Application

### 1. Start Backend
```bash
# From backend directory
uvicorn main:app --reload
```
Backend will run on `http://localhost:8000`

### 2. Start Frontend
```bash
# From frontend directory
npm run dev
```
Frontend will run on `http://localhost:3000`

## Testing the Application

### 1. User Registration
1. Navigate to `http://localhost:3000/signup`
2. Register with a valid email and password
3. Verify account creation

### 2. User Login
1. Navigate to `http://localhost:3000/login`
2. Log in with registered credentials
3. Verify successful authentication

### 3. Task Operations
1. Navigate to `http://localhost:3000/dashboard`
2. Create a new task using the form
3. Verify task appears in the list
4. Update task details
5. Toggle task completion status
6. Delete a task

## API Testing
The backend provides API documentation at `http://localhost:8000/docs` (Swagger UI).

## Troubleshooting

### Common Issues
- **Database Connection**: Ensure DATABASE_URL is correctly set with proper credentials and sslmode=require (per SP.Constitution)
- **Authentication**: Verify that BETTER_AUTH_SECRET is identical in both frontend and backend (per SP.Constitution section 5.2)
- **CORS**: Check that frontend URL is allowed in backend CORS configuration (per SP.Constitution section 6.1)
- **User Isolation**: Verify that user_id in URL matches authenticated user_id (per SP.Constitution section 5.1)

### Error Codes
- 401: Unauthorized - Check authentication token (per SP.Constitution section 5.3)
- 403: Forbidden - Verify user_id matches authenticated user (per SP.Constitution section 5.3)
- 404: Not Found - Resource doesn't exist
- 500: Server Error - Check server logs

## Development Workflow
1. Make changes to specification files in `/specs/`
2. Generate implementation based on updated specs
3. Test functionality locally
4. Commit changes with meaningful messages following SP.Constitution section 13.1
5. Push to repository for deployment