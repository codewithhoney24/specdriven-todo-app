# Todo Application

This is a full-stack todo application with authentication and task management features.

## Fix for Loading Issue

The deployed application at https://specdriven-todo-app.vercel.app/ may appear stuck on loading. This is because the frontend is deployed to Vercel but the backend API URL is not properly configured.

### Solution:

1. **Deploy the backend API**:
   ```bash
   # Make the deployment script executable (Linux/Mac)
   chmod +x deploy_backend.sh
   ./deploy_backend.sh
   ```

   Or on Windows:
   ```cmd
   deploy_backend.bat
   ```

2. **Get the backend deployment URL** from the Vercel deployment output.

3. **Configure the frontend environment variable**:
   - Go to your Vercel dashboard for the frontend project
   - Navigate to Settings → Environment Variables
   - Update the `NEXT_PUBLIC_API_URL` variable to point to your deployed backend API URL
   - The URL should be in the format: `https://your-backend-project-name.vercel.app`

4. **Redeploy the frontend** after updating the environment variable.

### For Local Development:
Set the environment variable in your local `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Fresh Deployment (Recommended)

If you're starting fresh or the previous deployment was deleted, use the complete deployment script:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Log in to your Vercel account**:
   ```bash
   vercel login
   ```

3. **Run the complete deployment script**:
   ```bash
   # On Linux/Mac:
   chmod +x deploy_complete_app.sh
   ./deploy_complete_app.sh

   # On Windows:
   deploy_complete_app.bat
   ```

This script will deploy both the backend and frontend, automatically configure the API URL, and provide you with the deployment URLs for both.

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