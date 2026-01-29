#!/bin/bash

# Comprehensive deployment script for the Todo Application
# This script will help you deploy both the backend and frontend to Vercel

echo "==========================================="
echo "Todo Application Deployment Script"
echo "==========================================="
echo ""
echo "Before proceeding, make sure you:"
echo "1. Have logged in to Vercel CLI using 'vercel login'"
echo "2. Have the necessary environment variables ready"
echo ""

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ You are not logged in to Vercel. Please run 'vercel login' first."
    exit 1
fi

echo "✅ You are logged in to Vercel."

echo ""
echo "Step 1: Deploying Backend API..."
echo "=================================="

# Navigate to backend directory
cd backend

# Deploy the backend to Vercel
echo "Deploying backend..."
BACKEND_URL=$(vercel --public --yes --cwd .)

# Extract the actual deployment URL
BACKEND_URL=$(vercel --cwd . --scope nousheen-atif | grep -E "https://.*\.vercel\.app" | head -n1)

if [ -z "$BACKEND_URL" ]; then
    # If the above doesn't work, try alternate approach
    BACKEND_URL=$(vercel --cwd . --prod --scope nousheen-atif 2>&1 | grep -E "https://.*\.vercel\.app" | tail -n1)
fi

echo "Backend deployed to: $BACKEND_URL"

echo ""
echo "Step 2: Deploying Frontend..."
echo "=================================="

# Navigate back to the main directory and then to frontend
cd ../frontend

# Create or update the .env.local file with the backend URL
echo "NEXT_PUBLIC_API_URL=$BACKEND_URL" > .env.local

echo "Environment variable set in frontend: NEXT_PUBLIC_API_URL=$BACKEND_URL"

# Deploy the frontend to Vercel
echo "Deploying frontend..."
FRONTEND_URL=$(vercel --public --yes --cwd .)

# Extract the actual deployment URL
FRONTEND_URL=$(vercel --cwd . --scope nousheen-atif | grep -E "https://.*\.vercel\.app" | head -n1)

echo "Frontend deployed to: $FRONTEND_URL"

echo ""
echo "==========================================="
echo "Deployment Complete!"
echo "==========================================="
echo "Backend API: $BACKEND_URL"
echo "Frontend App: $FRONTEND_URL"
echo ""
echo "🎉 Your Todo application is now deployed!"
echo "📝 Remember to add these URLs to your configuration if needed."
echo ""
echo "💡 Note: If you experience any loading issues, ensure that:"
echo "   - The NEXT_PUBLIC_API_URL in your frontend deployment points to your backend"
echo "   - CORS settings in your backend allow requests from your frontend domain"
echo ""