#!/bin/bash
# Deployment script for hackathon-todo-phase2

set -e  # Exit on any error

echo "Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "Error: This script must be run from the project root directory."
    exit 1
fi

echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Checking for environment variables..."
if [ ! -f ".env.production" ]; then
    echo "Warning: frontend/.env.production not found. Please ensure NEXT_PUBLIC_API_URL is set in Vercel dashboard."
else
    echo "Using environment variables from frontend/.env.production"
fi

echo "Deployment preparation complete!"
echo ""
echo "To deploy to Vercel:"
echo "1. Make sure your backend is deployed and accessible"
echo "2. Set NEXT_PUBLIC_API_URL in Vercel dashboard to point to your backend API"
echo "3. Run 'vercel --prod' from the frontend directory"
echo ""
echo "For backend deployment options, see VERCEL_DEPLOYMENT.md"