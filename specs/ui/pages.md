# UI Pages - Hackathon Todo Phase II
*Reference: SP.Constitution sections 2.1, 7, 12*

## Overview
This specification defines the UI pages for the Hackathon Phase II Todo Application. The pages are built with Next.js App Router and follow proper authentication flow with protected routes.

## Page Specifications

### Home/Landing Page (/)
**Purpose**: Landing page for unauthenticated users with login/signup options  
**Route**: `/`  
**Authentication Requirement**: None (public page)  
**Layout**: Simple landing page with navigation to auth pages  
**Components Used**: 
- Hero section with app description
- Call-to-action buttons linking to login/signup
- Footer with app information

**Data Fetching**: None (static content)  
**Example Structure**:
```tsx
// frontend/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Manage your tasks with</span>
                  <span className="block text-indigo-600">Todo App</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  A simple and secure todo application with user authentication and task management.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Login
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Login Page (/login)
**Purpose**: User authentication page for existing users  
**Route**: `/login`  
**Authentication Requirement**: None (public page)  
**Layout**: Centered authentication form  
**Components Used**: 
- Better Auth login form
- Link to signup page
- Form validation and error handling

**Data Fetching**: None (form submission handled by Better Auth)  
**Example Structure**:
```tsx
// frontend/app/login/page.tsx
'use client';
import { signIn } from 'better-auth/client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (response?.error) {
        setError(response.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Signup Page (/signup)
**Purpose**: User registration page for new users  
**Route**: `/signup`  
**Authentication Requirement**: None (public page)  
**Layout**: Centered registration form  
**Components Used**: 
- Better Auth signup form
- Link to login page
- Form validation and error handling

**Data Fetching**: None (form submission handled by Better Auth)  
**Example Structure**:
```tsx
// frontend/app/signup/page.tsx
'use client';
import { signUp } from 'better-auth/client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await signUp({
        name,
        email,
        password,
        redirect: false,
      });
      
      if (response?.error) {
        setError(response.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Dashboard Page (/dashboard)
**Purpose**: Main application page showing user's tasks  
**Route**: `/dashboard`  
**Authentication Requirement**: Required (protected route)  
**Layout**: Main application layout with navigation and task management  
**Components Used**: 
- Navbar component
- AddTaskForm component
- TaskList component
- Loading and error states

**Data Fetching**: Server component to fetch user's tasks  
**Example Structure**:
```tsx
// frontend/app/dashboard/page.tsx
import { getAuth } from 'better-auth/client';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AddTaskForm from '@/components/AddTaskForm';
import TaskList from '@/components/TaskList';

export default async function DashboardPage() {
  // Check if user is authenticated
  const auth = await getAuth();
  
  if (!auth) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <AddTaskForm />
          <TaskList />
        </div>
      </main>
    </div>
  );
}
```

## Authentication Protection
All pages except `/`, `/login`, and `/signup` should be protected:
```tsx
// frontend/utils/auth-guard.ts
import { getAuth } from 'better-auth/client';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const auth = await getAuth();
  
  if (!auth) {
    redirect('/login');
  }
  
  return auth;
}
```

## Layout Structure
- Root layout with basic HTML structure
- Protected layout wrapper for authenticated routes
- Consistent styling and spacing across all pages
- Responsive design for all screen sizes

## Error Handling
- Global error boundaries for unexpected errors
- Form validation with clear error messages
- Network error handling with user feedback
- Loading states for all async operations

## SEO Considerations
- Proper meta tags for each page
- Semantic HTML structure
- Accessibility attributes
- Image optimization

*Last Updated: 2026-01-24*
*Status: Ready*