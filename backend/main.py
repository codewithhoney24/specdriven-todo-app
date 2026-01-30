from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, tasks
from middleware.auth import verify_token
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import models to register them with SQLModel
from models import Task, Subtask

# Create FastAPI app instance
app = FastAPI(title="Todo Application API", version="1.0.0")

# Add logging middleware to see incoming requests
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Incoming request: {request.method} {request.url.path}")
    if request.query_params:
        print(f"Query params: {request.query_params}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

# Initialize the database
from sqlmodel import SQLModel
from db import engine
SQLModel.metadata.create_all(bind=engine)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[

    
        "https://frontend-nousheen-atif.vercel.app",
        "https://frontend-28ju7hx0q-nousheen-atif.vercel.app",
        "https://frontend-562i1z9z4-nousheen-atif.vercel.app",
        "https://frontend-562i1z9z4-nousheen-atif.vercel.app/",
        "https://codewithhoney24-todo-task.hf.space",
        "http://localhost:3000",  # Local development
        "http://localhost:3001",  # Alternative local dev port
        "http://localhost:8000",  # Local backend for testing
        "http://127.0.0.1:3000",  # Alternative local dev
        "http://127.0.0.1:3001",  # Alternative local dev
        "https://vercel.app",     # General Vercel domain
        "https://codewithhoney24-todo-task.hf.space",  # Hugging Face Space
        "*"  # Allow all origins for local development (be cautious in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

@app.get("/")
def read_root():
    """
    Root endpoint for the API.
    
    Returns:
        dict: Welcome message
    """
    return {"message": "Welcome to the Todo Application API"}

@app.get("/health")
def health_check():
    """
    Health check endpoint.
    
    Returns:
        dict: Health status
    """
    return {"status": "healthy"}