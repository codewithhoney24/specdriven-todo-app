# Todo Application

This is a full-stack todo application with authentication and task management features.

## Architecture

- **Frontend**: Next.js 16+ application with Tailwind CSS and Better Auth
- **Backend**: FastAPI application with SQLModel and PostgreSQL
- **Authentication**: JWT-based authentication system

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
4. Update the values in `.env` with your actual values.

5. Run the backend:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by copying `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   
4. Update `NEXT_PUBLIC_API_URL` to point to your deployed backend API.

5. Run the frontend:
   ```bash
   npm run dev
   ```

## Deployment

### Backend Deployment

Deploy the backend to a platform like Railway, Render, or AWS. Make sure to set the environment variables in your deployment platform.

### Frontend Deployment

Deploy the frontend to Vercel. In your Vercel dashboard, set the `NEXT_PUBLIC_API_URL` environment variable to point to your deployed backend API.

## Important Notes

- The backend CORS settings are configured to allow requests from Vercel deployments and local development environments.
- Make sure both frontend and backend use the same `BETTER_AUTH_SECRET` for authentication to work properly.
- For production deployments, ensure you're using strong, unique values for all secret keys.