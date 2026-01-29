# Deploying to Vercel

This document explains how to properly deploy the application to Vercel and fix common authentication issues.

## Prerequisites

- A Vercel account
- The Vercel CLI installed (`npm i -g vercel`)
- Properly configured environment variables

## Deployment Steps

### 1. Frontend Deployment

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Set up environment variables in Vercel:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add the following variable:
     ```
     NEXT_PUBLIC_API_URL = https://your-backend-domain.com/api
     ```
   
   For example, if your backend is deployed at `https://todo-backend-example.up.railway.app`:
   ```
   NEXT_PUBLIC_API_URL = https://todo-backend-example.up.railway.app/api
   ```

3. Deploy the frontend:
   ```bash
   vercel --prod
   ```

### 2. Backend Deployment

For the backend, you can deploy to platforms like Railway, Render, or AWS:

#### Option A: Deploy to Railway

1. Sign up at [Railway](https://railway.app)
2. Connect your GitHub repository
3. Create a new project and link it to your repository
4. Add the following environment variables in the Railway dashboard:
   ```
   BETTER_AUTH_SECRET = your-super-secret-key-here-at-least-32-characters-long
   JWT_ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 10080
   DATABASE_URL = your-database-url
   ```
5. Deploy the backend service

#### Option B: Deploy to Render

1. Sign up at [Render](https://render.com)
2. Create a new Web Service
3. Connect to your GitHub repository
4. Set the runtime to Python
5. Add the same environment variables as mentioned above
6. Set the start command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. Important Configuration Notes

1. **CORS Settings**: The backend already includes the Vercel deployment URL in the CORS configuration:
   ```
   https://specdriven-todo-app-653i.vercel.app
   ```

2. **Environment Variables**: 
   - `NEXT_PUBLIC_API_URL` in the frontend should point to your deployed backend API
   - `BETTER_AUTH_SECRET` in the backend should be a strong secret key (at least 32 characters)

3. **Authentication Flow**:
   - The frontend will make requests to the backend API using the `NEXT_PUBLIC_API_URL`
   - Authentication tokens are stored in the browser's localStorage
   - The backend verifies tokens using the same secret key

### 4. Troubleshooting Common Issues

#### Issue: "Dashboard access not working on Vercel"

**Cause**: Mismatched API URLs between frontend and backend

**Solution**:
1. Verify that `NEXT_PUBLIC_API_URL` in Vercel environment variables points to your deployed backend
2. Ensure the backend CORS settings include your Vercel deployment URL
3. Check that the `BETTER_AUTH_SECRET` is identical in both frontend and backend deployments

#### Issue: "Token validation failing"

**Cause**: Different secret keys between frontend and backend

**Solution**:
1. Ensure the `BETTER_AUTH_SECRET` environment variable is the same in both deployments
2. Regenerate authentication tokens after updating the secret

#### Issue: "CORS errors in browser console"

**Solution**:
1. Verify that your backend CORS settings include your frontend domain
2. Check that the backend is returning proper CORS headers

### 5. Verification Steps

After deployment:

1. Visit your Vercel frontend URL
2. Try logging in/registering to ensure authentication works
3. Check browser developer tools for any CORS or network errors
4. Verify that user data persists correctly

## Security Best Practices

1. Use strong, unique values for `BETTER_AUTH_SECRET`
2. Never commit secrets to version control
3. Regularly rotate your authentication secrets
4. Change database credentials if they were exposed
5. Monitor your deployment logs for suspicious activity
6. Use environment variables for all sensitive data
7. Ensure your database connection uses SSL/TLS