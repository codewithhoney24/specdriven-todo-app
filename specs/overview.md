# Project Overview - Hackathon Todo Phase II
*Reference: SP.Constitution sections 3, 12*

## Overview
This document provides an overview of the Hackathon Phase II Full-Stack Todo Application. The project implements a complete todo management system with user authentication, allowing users to create, read, update, and delete their personal tasks in a secure environment.

## Project Purpose
- Build a full-stack todo application demonstrating modern web development practices
- Implement spec-driven development methodology using Claude Code
- Showcase integration between Next.js frontend and FastAPI backend
- Demonstrate proper authentication and user data isolation

## Technology Stack
- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS, Better Auth
- **Backend**: Python FastAPI, SQLModel ORM
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

## Features
- [x] User Authentication (Signup/Login/Logout) using Better Auth
- [x] Add Task - Create new todo items
- [x] View Task List - Display all tasks for authenticated user
- [x] Update Task - Modify existing task details
- [x] Delete Task - Remove tasks from list
- [x] Mark as Complete - Toggle task completion status
- [x] Responsive UI design
- [ ] Deployment to cloud platforms

## System Architecture
```
┌─────────────────┐    HTTP/HTTPS     ┌──────────────────┐
│   Frontend      │ ◄───────────────► │    Backend       │
│ (Next.js App)   │                   │  (FastAPI App)   │
│                 │                   │                  │
│ - Better Auth   │                   │ - JWT Middleware │
│ - Task UI       │                   │ - SQLModel ORM   │
│ - API Client    │                   │ - Neon DB        │
└─────────────────┘                   └──────────────────┘
                                              │
                                        ┌─────────────────┐
                                        │   Database      │
                                        │ (Neon PostgreSQL)│
                                        └─────────────────┘
```

## Authentication Flow
1. User accesses the application
2. If not authenticated, redirected to login/signup
3. Better Auth handles credential validation
4. JWT token issued and stored securely
5. Token included in all API requests
6. Backend validates token and extracts user identity
7. All data operations filtered by authenticated user_id

## Success Criteria
- [ ] Users can signup with valid credentials
- [ ] Users can login and maintain session
- [ ] Users can create new tasks
- [ ] Users can view their task list
- [ ] Users can update task details
- [ ] Users can delete tasks
- [ ] Users can mark tasks as complete/incomplete
- [ ] Each user sees only their own tasks
- [ ] UI is responsive on mobile and desktop
- [ ] Application deployed to cloud platforms
- [ ] All functionality works end-to-end

## Timeline and Milestones
- **Week 1 (Days 1-3)**: Setup, database schema, backend API
- **Week 2 (Days 4-7)**: Frontend implementation, integration, deployment
- **Day 7**: Project submission deadline

## Submission Requirements
- [ ] GitHub repository with all code and specs
- [ ] Working demo deployed to cloud platforms
- [ ] Video demonstration under 90 seconds
- [ ] Completed project form

*Last Updated: 2026-01-24*
*Status: Ready*