#!/usr/bin/env python3
"""
Simple test script to debug the task API issue
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from sqlmodel import Session, select
from backend.db import engine
from backend.models import Task

def test_db_connection():
    print("Testing database connection...")
    try:
        with Session(engine) as session:
            # Try to query tasks
            statement = select(Task).where(Task.user_id == "mock-test-973dfe463ec85785")
            tasks = session.exec(statement).all()
            print(f"Found {len(tasks)} tasks for user")
            for task in tasks:
                print(f"Task: {task.id}, {task.title}, {task.completed}")
    except Exception as e:
        print(f"Error querying tasks: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_db_connection()