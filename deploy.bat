@echo off
REM Deployment script for hackathon-todo-phase2 on Windows

echo Starting deployment process...

REM Check if we're in the right directory
if not exist "README.md" (
    echo Error: This script must be run from the project root directory.
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Error: frontend directory not found.
    pause
    exit /b 1
)

if not exist "backend" (
    echo Error: backend directory not found.
    pause
    exit /b 1
)

echo Building frontend...
cd frontend
npm install
npm run build

echo Checking for environment variables...
if not exist ".env.production" (
    echo Warning: frontend/.env.production not found. Please ensure NEXT_PUBLIC_API_URL is set in Vercel dashboard.
) else (
    echo Using environment variables from frontend/.env.production
)

echo Deployment preparation complete!
echo.
echo To deploy to Vercel:
echo 1. Make sure your backend is deployed and accessible
echo 2. Set NEXT_PUBLIC_API_URL in Vercel dashboard to point to your backend API
echo 3. Run 'vercel --prod' from the frontend directory
echo.
echo For backend deployment options, see VERCEL_DEPLOYMENT.md
pause