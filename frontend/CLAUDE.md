# Claude Code Context: Todo Application Frontend

## Project Overview

This is the frontend for a full-stack Todo Application built with Next.js, TypeScript, and Tailwind CSS. The application connects to a FastAPI backend for data management and uses Better Auth for authentication.

## Tech Stack

- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS
- Better Auth for authentication
- Axios for API requests

## Key Components

- `app/` - Contains Next.js App Router pages
  - `login/page.tsx` - User login page
  - `signup/page.tsx` - User registration page
  - `dashboard/page.tsx` - Main dashboard showing tasks
- `components/` - Reusable UI components
  - `Navbar.tsx` - Navigation bar with logout
  - `TaskList.tsx` - Displays all user tasks
  - `TaskItem.tsx` - Displays individual task with edit/delete options
  - `AddTaskForm.tsx` - Form for creating new tasks
  - `TaskCheckbox.tsx` - Checkbox for toggling task completion
- `lib/` - Utility functions and API client
  - `auth.ts` - Better Auth client setup
  - `api.ts` - API client with authentication
- `types/` - TypeScript type definitions
  - `task.ts` - Task interface definition

## Authentication

The application uses Better Auth for user authentication. The auth client is initialized in `lib/auth.ts` and provides functions for sign in, sign out, and session management.

## API Integration

The application communicates with the backend API through the client in `lib/api.ts`. This client automatically includes the authentication token in requests and handles common error scenarios.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: The URL of the backend API
- `BETTER_AUTH_SECRET`: Secret key for Better Auth (minimum 32 characters)
- `BETTER_AUTH_URL`: The URL of the frontend application

## Styling

The application uses Tailwind CSS for styling. All components are designed to be responsive and work well on both mobile and desktop devices.

## Key Features

1. User authentication (signup/login/logout)
2. Create, read, update, and delete tasks
3. Mark tasks as complete/incomplete
4. Responsive design for mobile and desktop
5. Secure user isolation (each user sees only their own tasks)