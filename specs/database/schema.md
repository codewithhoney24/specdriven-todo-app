# Database Schema - Hackathon Todo Phase II
*Reference: SP.Constitution sections 2.3, 8, 9*

## Overview
This specification defines the database schema for the Hackathon Phase II Todo Application. The schema includes tables for user management (handled by Better Auth) and task management with proper relationships and constraints.

## Database Connection
- **Provider**: Neon Serverless PostgreSQL
- **Connection String Format**: `postgresql://user:pass@host/db?sslmode=require`
- **SSL Mode**: Required for all connections

## Tables

### Users Table (Managed by Better Auth)
Better Auth manages the users table with the following structure:
- `id`: UUID (Primary Key)
- `email`: VARCHAR (Unique, Not Null)
- `name`: VARCHAR
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Tasks Table
The application manages the tasks table with the following structure:

#### Columns
- `id`: INTEGER (Primary Key, Auto-increment)
- `user_id`: UUID (Foreign Key to users.id, Not Null)
- `title`: VARCHAR(255) (Not Null)
- `description`: TEXT (Optional)
- `completed`: BOOLEAN (Default: False)
- `created_at`: TIMESTAMP (Default: Current timestamp)
- `updated_at`: TIMESTAMP (Default: Current timestamp, Updates on change)

#### Constraints
- Primary Key: `id`
- Foreign Key: `user_id` references `users.id` with CASCADE delete
- Not Null: `user_id`, `title`
- Check: `title` length > 0

#### Indexes
- `idx_user_id`: Index on `user_id` for performance (queries filtered by user)
- `idx_completed`: Index on `completed` for performance (filtering by completion status)
- `idx_user_completed`: Composite index on (`user_id`, `completed`) for common queries

## SQLModel Implementation
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Update updated_at on modification
    def __setattr__(self, name, value):
        if name == 'updated_at':
            super().__setattr__(name, datetime.utcnow())
        super().__setattr__(name, value)
```

## Query Patterns
All queries must filter by authenticated user_id for security:

```python
# Get all tasks for a user
tasks = session.exec(
    select(Task).where(Task.user_id == authenticated_user_id)
).all()

# Get specific task for a user
task = session.exec(
    select(Task).where(Task.id == task_id).where(Task.user_id == authenticated_user_id)
).first()

# Update task only if it belongs to user
task = session.exec(
    select(Task).where(Task.id == task_id).where(Task.user_id == authenticated_user_id)
).first()
if task:
    # Update task properties
    session.add(task)
    session.commit()
```

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string with sslmode=require

## Security Considerations
- All queries must filter by user_id to prevent unauthorized access
- Foreign key relationships enforce data integrity
- CASCADE delete ensures cleanup when user is deleted
- SSL encryption required for all database connections

*Last Updated: 2026-01-24*
*Status: Ready*