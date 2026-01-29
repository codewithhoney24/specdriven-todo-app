@echo off
echo Starting Todo Application...

REM Start the backend server in a separate window
echo Starting backend server...
start cmd /k "cd /d ..\backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

REM Wait a moment for the backend to start
timeout /t 3 /nobreak >nul

REM Start the frontend server
echo Starting frontend server...
cd /d ..\frontend
npm run dev