# Task CRUD Operations - Hackathon Todo Phase II
*Reference: SP.Constitution sections 4, 5, 6, 7*

## Overview
This specification defines the Create, Read, Update, Delete, and Complete operations for tasks in the Hackathon Phase II Todo Application. These operations allow users to manage their personal tasks with proper authentication and authorization.

## User Stories
- As a registered user, I want to create new tasks, so that I can track my to-dos
- As a registered user, I want to view all my tasks, so that I can see what I need to do
- As a registered user, I want to update my tasks, so that I can modify details as needed
- As a registered user, I want to delete my tasks, so that I can remove completed or irrelevant items
- As a registered user, I want to mark tasks as complete/incomplete, so that I can track my progress

## Acceptance Criteria
- [ ] Users can create tasks with title and optional description
- [ ] Users can view only their own tasks
- [ ] Users can update their own tasks
- [ ] Users can delete their own tasks
- [ ] Users can toggle task completion status
- [ ] Users cannot access other users' tasks
- [ ] All operations require valid authentication
- [ ] Appropriate error messages are shown for failed operations

## Technical Requirements

### Frontend
- Create form with title and description fields
- Display task list with titles, descriptions, and completion status
- Edit form for updating task details
- Confirmation dialog for deletion
- Checkbox for toggling completion status
- Loading states for all async operations
- Error handling with user-friendly messages

### Backend
- REST API endpoints for all CRUD operations
- JWT token validation for all protected endpoints
- User_id extraction from JWT token
- User_id filtering for all database queries
- Proper HTTP status codes
- Input validation for all requests

### Database
- Tasks table with proper foreign key relationship to users
- Indexes for efficient querying by user_id
- Cascade delete when user is removed
- Timestamps for created_at and updated_at

## API Integration
- POST /api/{user_id}/tasks - Create new task
- GET /api/{user_id}/tasks - Get all user tasks
- GET /api/{user_id}/tasks/{id} - Get specific task
- PUT /api/{user_id}/tasks/{id} - Update task
- DELETE /api/{user_id}/tasks/{id} - Delete task
- PATCH /api/{user_id}/tasks/{id}/complete - Toggle completion

## Error Handling
- 400: Invalid input data (missing title, invalid format)
- 401: Missing or invalid JWT token
- 403: User trying to access another user's task
- 404: Task does not exist
- 500: Server-side error during operation

## UI/UX Requirements
- Loading indicators during async operations
- Clear error messages when operations fail
- Confirmation dialog before deleting tasks
- Visual indication of task completion status
- Responsive design for all device sizes
- Intuitive form layout for task creation/editing

## Testing Checklist
- [ ] Create task with valid data succeeds
- [ ] Create task with missing title fails with 400
- [ ] Create task with empty title fails with 400
- [ ] View own tasks succeeds
- [ ] Attempt to view another user's tasks fails with 403
- [ ] Update own task succeeds
- [ ] Attempt to update another user's task fails with 403
- [ ] Delete own task succeeds
- [ ] Attempt to delete another user's task fails with 403
- [ ] Toggle completion status succeeds
- [ ] Attempt to toggle another user's task fails with 403
- [ ] All operations require valid JWT token

*Last Updated: 2026-01-24*
*Status: Ready*