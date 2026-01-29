from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from pydantic import BaseModel
from models import Task, TaskBase, Subtask
from middleware.auth import verify_token
from sqlmodel import Session, select
from db import engine
from datetime import datetime, timezone

# Initialize router
router = APIRouter()

class TaskCreate(TaskBase):
    """Request model for creating a task."""
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    """Request model for updating a task."""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[datetime] = None

class TaskToggleComplete(BaseModel):
    """Request model for toggling task completion."""
    completed: bool

class TaskResponse(TaskBase):
    """Response model for a task."""
    id: int
    user_id: str
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

@router.get("/{user_id}/tasks", response_model=List[TaskResponse])
def get_tasks(user_id: str, current_user_id: str = Depends(verify_token)):
    """
    Get all tasks for the specified user.

    Args:
        user_id: The ID of the user whose tasks to retrieve
        current_user_id: The ID of the authenticated user (from token)

    Returns:
        List[TaskResponse]: List of tasks for the user
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's tasks"
        )

    # Get database session
    with Session(engine) as session:
        # Query tasks for the authenticated user
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()

        # Convert tasks to response model to avoid relationship issues
        task_responses = []
        for task in tasks:
            task_response = TaskResponse(
                id=task.id,
                title=task.title,
                description=task.description,
                completed=task.completed,
                priority=task.priority,
                category=task.category,
                due_date=task.due_date,
                user_id=task.user_id,
                created_at=task.created_at,
                updated_at=task.updated_at
            )
            task_responses.append(task_response)

    return task_responses

@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(user_id: str, task_data: TaskCreate, current_user_id: str = Depends(verify_token)):
    """
    Create a new task for the specified user.

    Args:
        user_id: The ID of the user creating the task
        task_data: Task creation data
        current_user_id: The ID of the authenticated user (from token)

    Returns:
        TaskResponse: Created task
    """
    # Verify that the user_id in the URL matches the authenticated user_id
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot create tasks for another user"
        )

    # Create task instance
    task = Task(
        title=task_data.title,
        description=task_data.description,
        completed=task_data.completed,
        priority=task_data.priority,
        category=task_data.category,
        due_date=task_data.due_date,
        user_id=user_id
    )

    # Get database session and save the task
    with Session(engine) as session:
        session.add(task)
        session.commit()
        session.refresh(task)

    return task

@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def get_task(user_id: str, task_id: int, current_user_id: str = Depends(verify_token)):
    """
    Get a specific task for the specified user.
    
    Args:
        user_id: The ID of the user whose task to retrieve
        task_id: The ID of the task to retrieve
        current_user_id: The ID of the authenticated user (from token)
        
    Returns:
        TaskResponse: The requested task
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's task"
        )
    
    # Get database session
    with Session(engine) as session:
        # Query the specific task for the authenticated user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

    task_response = TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        priority=task.priority,
        category=task.category,
        due_date=task.due_date,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )
    return task_response

@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(user_id: str, task_id: int, task_data: TaskUpdate, current_user_id: str = Depends(verify_token)):
    """
    Update an existing task for the specified user.
    
    Args:
        user_id: The ID of the user whose task to update
        task_id: The ID of the task to update
        task_data: Task update data
        current_user_id: The ID of the authenticated user (from token)
        
    Returns:
        TaskResponse: Updated task
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot update another user's task"
        )
    
    # Get database session
    with Session(engine) as session:
        # Query the specific task for the authenticated user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        # Update task fields if provided
        update_data = task_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)
        
        # Update the updated_at timestamp
        task.updated_at = datetime.now(timezone.utc)

        session.add(task)
        session.commit()
        session.refresh(task)

    task_response = TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        priority=task.priority,
        category=task.category,
        due_date=task.due_date,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )
    return task_response

@router.delete("/{user_id}/tasks/{task_id}")
def delete_task(user_id: str, task_id: int, current_user_id: str = Depends(verify_token)):
    """
    Delete a specific task for the specified user.
    
    Args:
        user_id: The ID of the user whose task to delete
        task_id: The ID of the task to delete
        current_user_id: The ID of the authenticated user (from token)
        
    Returns:
        dict: Success message
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot delete another user's task"
        )
    
    # Get database session
    with Session(engine) as session:
        # Query the specific task for the authenticated user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        session.delete(task)
        session.commit()
        
    return {"message": "Task deleted successfully"}

@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_task_complete(user_id: str, task_id: int, task_data: TaskToggleComplete, current_user_id: str = Depends(verify_token)):
    """
    Toggle the completion status of a specific task for the specified user.

    Args:
        user_id: The ID of the user whose task to update
        task_id: The ID of the task to update
        task_data: Task completion data
        current_user_id: The ID of the authenticated user (from token)

    Returns:
        TaskResponse: Updated task
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot update another user's task"
        )

    # Get database session
    with Session(engine) as session:
        # Query the specific task for the authenticated user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Update the completion status
        task.completed = task_data.completed
        # NOTE: We don't update updated_at here to distinguish between content updates and status changes

        session.add(task)
        session.commit()
        session.refresh(task)

    task_response = TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        priority=task.priority,
        category=task.category,
        due_date=task.due_date,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )
    return task_response
# Subtask Routes
from models import Subtask

class SubtaskCreate(BaseModel):
    """Request model for creating a subtask."""
    title: str
    completed: bool = False

class SubtaskUpdate(BaseModel):
    """Request model for updating a subtask."""
    title: Optional[str] = None
    completed: Optional[bool] = None

class SubtaskResponse(BaseModel):
    """Response model for a subtask."""
    id: int
    task_id: int
    title: str
    completed: bool
    created_at: datetime
    updated_at: datetime

@router.post("/{user_id}/tasks/{task_id}/subtasks", response_model=SubtaskResponse, status_code=status.HTTP_201_CREATED)
def create_subtask(
    user_id: str,
    task_id: int,
    subtask_data: SubtaskCreate,
    current_user_id: str = Depends(verify_token)
):
    """
    Create a new subtask for the specified task.

    Args:
        user_id: The ID of the user who owns the parent task
        task_id: The ID of the parent task
        subtask_data: Subtask creation data
        current_user_id: The ID of the authenticated user (from token)

    Returns:
        SubtaskResponse: Created subtask
    """
    # Verify that the user_id matches the authenticated user_id
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot create subtasks for another user's task"
        )

    # Verify that the task belongs to the user
    with Session(engine) as session:
        task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == user_id)).first()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or does not belong to user"
            )

        # Create subtask instance
        subtask = Subtask(
            title=subtask_data.title,
            completed=subtask_data.completed,
            task_id=task_id
        )

        session.add(subtask)
        session.commit()
        session.refresh(subtask)

    return subtask

@router.get("/{user_id}/tasks/{task_id}/subtasks", response_model=List[SubtaskResponse])
def get_subtasks(
    user_id: str,
    task_id: int,
    current_user_id: str = Depends(verify_token)
):
    """
    Get all subtasks for the specified task.

    Args:
        user_id: The ID of the user who owns the parent task
        task_id: The ID of the parent task
        current_user_id: The ID of the authenticated user (from token)

    Returns:
        List[SubtaskResponse]: List of subtasks for the task
    """
    # Verify that the user_id matches the authenticated user_id
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's task subtasks"
        )

    # Verify that the task belongs to the user
    with Session(engine) as session:
        task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == user_id)).first()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or does not belong to user"
            )

        # Query subtasks for the task
        statement = select(Subtask).where(Subtask.task_id == task_id)
        subtasks = session.exec(statement).all()

    return subtasks

@router.put("/{user_id}/tasks/{task_id}/subtasks/{subtask_id}", response_model=SubtaskResponse)
def update_subtask(
    user_id: str,
    task_id: int,
    subtask_id: int,
    subtask_data: SubtaskUpdate,
    current_user_id: str = Depends(verify_token)
):
    """
    Update an existing subtask for the specified task.

    Args:
        user_id: The ID of the user who owns the parent task
        task_id: The ID of the parent task
        subtask_id: The ID of the subtask to update
        subtask_data: Subtask update data
        current_user_id: The ID of the authenticated user (from token)

    Returns:
        SubtaskResponse: Updated subtask
    """
    # Verify that the user_id matches the authenticated user_id
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot update another user's subtask"
        )

    # Verify that the task belongs to the user and the subtask belongs to the task
    with Session(engine) as session:
        task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == user_id)).first()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or does not belong to user"
            )

        subtask = session.exec(
            select(Subtask).where(Subtask.id == subtask_id).where(Subtask.task_id == task_id)
        ).first()

        if not subtask:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subtask not found or does not belong to the specified task"
            )

        # Update subtask fields if provided
        update_data = subtask_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(subtask, field, value)

        # Update the updated_at timestamp
        subtask.updated_at = datetime.now(timezone.utc)

        session.add(subtask)
        session.commit()
        session.refresh(subtask)

    return subtask

@router.delete("/{user_id}/tasks/{task_id}/subtasks/{subtask_id}")
def delete_subtask(
    user_id: str,
    task_id: int,
    subtask_id: int,
    current_user_id: str = Depends(verify_token)
):
    """
    Delete a specific subtask for the specified task.

    Args:
        user_id: The ID of the user who owns the parent task
        task_id: The ID of the parent task
        subtask_id: The ID of the subtask to delete
        current_user_id: The ID of the authenticated user (from token)

    Returns:
        dict: Success message
    """
    # Verify that the user_id matches the authenticated user_id
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot delete another user's subtask"
        )

    # Verify that the task belongs to the user and the subtask belongs to the task
    with Session(engine) as session:
        task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == user_id)).first()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or does not belong to user"
            )

        subtask = session.exec(
            select(Subtask).where(Subtask.id == subtask_id).where(Subtask.task_id == task_id)
        ).first()

        if not subtask:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subtask not found or does not belong to the specified task"
            )

        session.delete(subtask)
        session.commit()

    return {"message": "Subtask deleted successfully"}