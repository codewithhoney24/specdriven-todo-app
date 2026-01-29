# Todo Application Frontend

This is the frontend for the Todo Application, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (signup/login/logout)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Responsive design for mobile and desktop
- Secure user isolation (each user sees only their own tasks)

## Tech Stack

- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS
- Better Auth for authentication
- Axios for API requests

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with the following environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   BETTER_AUTH_SECRET=your-32-characters-long-secret-here
   BETTER_AUTH_URL=http://localhost:3000
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: The URL of the backend API
- `BETTER_AUTH_SECRET`: Secret key for Better Auth (minimum 32 characters)
- `BETTER_AUTH_URL`: The URL of the frontend application

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run the linter

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   └── dashboard/       # Dashboard page
├── components/          # Reusable UI components
├── lib/                 # Utility functions and API client
├── types/               # TypeScript type definitions
└── CLAUDE.md            # Claude Code context
```