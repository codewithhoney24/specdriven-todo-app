"""
Task service module for the Todo Application.

This module provides functions for managing tasks including
creating, retrieving, updating, and deleting tasks.
"""

from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime
from ..models import Task, TaskBase
from ..db import engine

def get_user_tasks(user_id: str) -> List[Task]:
    """
    Get all tasks for a specific user.
    
    Args:
        user_id: The ID of the user whose tasks to retrieve
        
    Returns:
        List[Task]: List of tasks for the user
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()
        return tasks

def get_user_task(user_id: str, task_id: int) -> Optional[Task]:
    """
    Get a specific task for a user.
    
    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to retrieve
        
    Returns:
        Task: The requested task if found, None otherwise
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        return task

def create_task_for_user(user_id: str, task_data: TaskBase) -> Task:
    """
    Create a new task for a user.
    
    Args:
        user_id: The ID of the user creating the task
        task_data: Task creation data
        
    Returns:
        Task: The created task
    """
    task = Task.from_orm(task_data)
    task.user_id = user_id
    task.created_at = datetime.utcnow()
    task.updated_at = datetime.utcnow()
    
    with Session(engine) as session:
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

def update_user_task(user_id: str, task_id: int, task_data: dict) -> Optional[Task]:
    """
    Update an existing task for a user.
    
    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to update
        task_data: Dictionary of fields to update
        
    Returns:
        Task: The updated task if successful, None otherwise
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        
        if not task:
            return None
        
        # Update task fields
        for field, value in task_data.items():
            if hasattr(task, field) and value is not None:
                setattr(task, field, value)
        
        # Update the updated_at timestamp
        task.updated_at = datetime.utcnow()
        
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

def delete_user_task(user_id: str, task_id: int) -> bool:
    """
    Delete a task for a user.
    
    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to delete
        
    Returns:
        bool: True if deletion was successful, False otherwise
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        
        if not task:
            return False
        
        session.delete(task)
        session.commit()
        return True

def toggle_user_task_completion(user_id: str, task_id: int, completed: bool) -> Optional[Task]:
    """
    Toggle the completion status of a task for a user.
    
    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to update
        completed: The new completion status
        
    Returns:
        Task: The updated task if successful, None otherwise
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        
        if not task:
            return None
        
        # Update the completion status
        task.completed = completed
        task.updated_at = datetime.utcnow()
        
        session.add(task)
        session.commit()
        session.refresh(task)
        return task