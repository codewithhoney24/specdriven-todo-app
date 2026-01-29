@echo off
echo Deploying backend to Vercel...

REM Navigate to the backend directory
cd backend

REM Install dependencies
pip install -r requirements.txt

REM Deploy to Vercel
vercel --prod

echo Backend deployed successfully!
echo Please note the deployment URL and update the frontend's NEXT_PUBLIC_API_URL accordingly.
pause