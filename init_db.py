from backend.db import engine
from backend.models import Task, Subtask
from sqlmodel import SQLModel
from sqlalchemy import inspect

# Check if tables need to be recreated
inspector = inspect(engine)
existing_tables = inspector.get_table_names()

# Drop all existing tables if they exist
for table_name in existing_tables:
    print(f"Dropping existing table: {table_name}")

# Create all tables
SQLModel.metadata.drop_all(engine)
SQLModel.metadata.create_all(engine)
print("Database tables created successfully!")