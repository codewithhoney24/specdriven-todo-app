from sqlmodel import SQLModel
from db import engine
from models import Task, Subtask  # Import all models to register them with SQLModel

def init_db():
    """Initialize the database and create tables."""
    print("Initializing database...")
    try:
        # Create all tables
        SQLModel.metadata.create_all(engine)
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

if __name__ == "__main__":
    init_db()