# Data Model: Todo Application

**Feature**: Todo Application  
**Date**: 2026-01-24  
**Branch**: 002-todo-specs

## Overview
Data model for the full-stack todo application with user authentication, following SP.Constitution database standards.

## Entities

### User
*Managed by Better Auth (following SP.Constitution section 5.1)*

**Attributes**:
- `id`: UUID (Primary Key) - managed by Better Auth
- `email`: VARCHAR (Unique, Not Null) - managed by Better Auth
- `name`: VARCHAR - managed by Better Auth
- `created_at`: TIMESTAMP - managed by Better Auth
- `updated_at`: TIMESTAMP - managed by Better Auth

### Task
*Managed by application (following SP.Constitution section 8.2)*

**Attributes**:
- `id`: Integer (Primary Key, Auto-increment)
- `user_id`: UUID (Foreign Key to User.id, Not Null) - for user isolation
- `title`: String (Max 255 chars, Not Null) - task title
- `description`: Text (Optional) - task description
- `completed`: Boolean (Default: False) - completion status
- `created_at`: DateTime (Default: Current timestamp) - creation timestamp
- `updated_at`: DateTime (Default: Current timestamp, Updates on change) - modification timestamp

## Relationships
- **User → Task**: One-to-Many (One user can have many tasks)
- **Foreign Key Constraint**: Task.user_id references User.id with CASCADE delete (following SP.Constitution section 2.3)

## Indexes
- `idx_user_id`: Index on Task.user_id for performance (queries filtered by user) (following SP.Constitution section 2.3)
- `idx_completed`: Index on Task.completed for performance (filtering by completion status)
- `idx_user_completed`: Composite index on (Task.user_id, Task.completed) for common queries

## Constraints
- Primary Key: `id` on both User and Task tables
- Foreign Key: `user_id` references `users.id` with CASCADE delete (following SP.Constitution section 2.3)
- Not Null: `user_id`, `title` on Task table
- Check: `title` length > 0 to ensure non-empty titles

## SQLModel Implementation

```python
from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional
from datetime import datetime
import uuid

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", nullable=False)  # Better Auth user ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## Query Patterns
All queries must filter by authenticated user_id for security (following SP.Constitution section 5.1):

```python
from sqlmodel import select

# Get all tasks for a user
def get_user_tasks(session: Session, authenticated_user_id: str):
    tasks = session.exec(
        select(Task).where(Task.user_id == authenticated_user_id)
    ).all()
    return tasks

# Get specific task for a user
def get_user_task(session: Session, task_id: int, authenticated_user_id: str):
    task = session.exec(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == authenticated_user_id)
    ).first()
    return task

# Update task only if it belongs to user
def update_user_task(session: Session, task_id: int, authenticated_user_id: str, **updates):
    task = session.exec(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == authenticated_user_id)
    ).first()
    
    if task:
        for key, value in updates.items():
            setattr(task, key, value)
        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        session.refresh(task)
        return task
    return None

# Delete task only if it belongs to user
def delete_user_task(session: Session, task_id: int, authenticated_user_id: str):
    task = session.exec(
        select(Task)
        .where(Task.id == task_id)
        .where(Task.user_id == authenticated_user_id)
    ).first()
    
    if task:
        session.delete(task)
        session.commit()
        return True
    return False
```

## Validation Rules
- Task title must be 1-255 characters (enforced by Field constraints)
- User_id must match authenticated user (enforced by application logic)
- All modifications update the updated_at timestamp automatically
- Creation of tasks requires valid user_id from authenticated session