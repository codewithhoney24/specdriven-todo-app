@echo off
echo ===========================================
echo Todo Application Deployment Script
echo ===========================================
echo.
echo Before proceeding, make sure you:
echo 1. Have logged in to Vercel CLI using 'vercel login'
echo 2. Have the necessary environment variables ready
echo.

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo ❌ You are not logged in to Vercel. Please run 'vercel login' first.
    pause
    exit /b 1
)

echo ✅ You are logged in to Vercel.
echo.
echo Step 1: Deploying Backend API...
echo ==================================

REM Navigate to backend directory
cd backend

echo Deploying backend...
REM Deploy the backend to Vercel
vercel --public --yes --cwd .

echo.
echo Retrieving backend deployment URL...
for /f "tokens=*" %%i in ('vercel --cwd . ^| findstr /R "https://.*\.vercel\.app"') do set BACKEND_URL=%%i

echo Backend deployed to: %BACKEND_URL%

echo.
echo Step 2: Deploying Frontend...
echo ==================================

REM Navigate back to the main directory and then to frontend
cd ..\frontend

REM Create or update the .env.local file with the backend URL
echo NEXT_PUBLIC_API_URL=%BACKEND_URL% > .env.local

echo Environment variable set in frontend: NEXT_PUBLIC_API_URL=%BACKEND_URL%

echo Deploying frontend...
REM Deploy the frontend to Vercel
vercel --public --yes --cwd .

echo.
echo Retrieving frontend deployment URL...
for /f "tokens=*" %%i in ('vercel --cwd . ^| findstr /R "https://.*\.vercel\.app"') do set FRONTEND_URL=%%i

echo.
echo ===========================================
echo Deployment Complete!
echo ===========================================
echo Backend API: %BACKEND_URL%
echo Frontend App: %FRONTEND_URL%
echo.
echo 🎉 Your Todo application is now deployed!
echo 📝 Remember to add these URLs to your configuration if needed.
echo.
echo 💡 Note: If you experience any loading issues, ensure that:
echo    - The NEXT_PUBLIC_API_URL in your frontend deployment points to your backend
echo    - CORS settings in your backend allow requests from your frontend domain
echo.
pause