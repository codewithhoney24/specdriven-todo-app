from sqlmodel import SQLModel, Field, create_engine, Session, Relationship
from typing import Optional, List
from datetime import datetime, timezone
import uuid

from enum import Enum

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TaskBase(SQLModel):
    """Base class for Task model with common fields."""
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    priority: PriorityEnum = Field(default=PriorityEnum.medium)  # Task priority
    category: Optional[str] = Field(default=None, max_length=50)  # Task category/tag
    due_date: Optional[datetime] = Field(default=None)  # Optional due date for the task

class SubtaskBase(SQLModel):
    """Base class for Subtask model with common fields."""
    title: str = Field(min_length=1, max_length=255)
    completed: bool = Field(default=False)

class Subtask(SubtaskBase, table=True):
    """Subtask model representing a subtask of a main task."""
    id: Optional[int] = Field(default=None, primary_key=True)
    task_id: int = Field(foreign_key="task.id", nullable=False)  # Foreign key to parent task
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Task(TaskBase, table=True):
    """Task model representing a todo item."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(nullable=False)  # Better Auth user ID (no FK constraint since users table is managed by Better Auth)
    due_date: Optional[datetime] = Field(default=None)  # Optional due date for the task
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationship to subtasks
    subtasks: List["Subtask"] = Relationship(sa_relationship_kwargs={"cascade": "all, delete-orphan"})