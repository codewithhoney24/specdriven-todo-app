#!/bin/bash
# Startup script for the Todo Application

echo "Starting Todo Application..."

# Start the backend server in the background
echo "Starting backend server..."
cd ../backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 3

# Start the frontend server
echo "Starting frontend server..."
cd ../frontend
npm run dev

# Kill the backend when frontend stops
trap "kill $BACKEND_PID" EXIT