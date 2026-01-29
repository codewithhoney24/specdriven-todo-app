#!/bin/bash

# Script to deploy the backend to Vercel
# This script assumes you have Vercel CLI installed (npm i -g vercel)

echo "Deploying backend to Vercel..."

# Navigate to the backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Deploy to Vercel
vercel --prod

echo "Backend deployed successfully!"
echo "Please note the deployment URL and update the frontend's NEXT_PUBLIC_API_URL accordingly."