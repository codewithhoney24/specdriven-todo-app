# UI Components - Hackathon Todo Phase II
*Reference: SP.Constitution sections 2.1, 7, 12*

## Overview
This specification defines the UI components for the Hackathon Phase II Todo Application. The components are built with Next.js and styled with Tailwind CSS, following a server-client component architecture.

## Component Specifications

### TaskList Component
**Purpose**: Display all tasks for the authenticated user  
**Type**: Server Component  
**Props**: None (fetches data internally)  
**State Management**: None (server-side data fetching)  
**API Calls**: GET /api/{user_id}/tasks  
**Styling Approach**: Tailwind CSS with responsive grid/list layout  
**Accessibility**: Keyboard navigation, screen reader support

**Example Code**:
```tsx
// frontend/components/TaskList.tsx
import { getTasks } from '@/lib/tasks';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default async function TaskList() {
  const tasks: Task[] = await getTasks();
  
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### TaskItem Component
**Purpose**: Display a single task with title, description, and completion status  
**Type**: Server Component  
**Props**: task (Task object)  
**State Management**: None (server-rendered)  
**API Calls**: None  
**Styling Approach**: Tailwind CSS with card-style layout  
**Accessibility**: Proper labeling, focus states

**Example Code**:
```tsx
// frontend/components/TaskItem.tsx
'use client';
import { Task } from '@/types/task';
import TaskCheckbox from './TaskCheckbox';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const [localTask, setLocalTask] = useState<Task>(task);
  
  return (
    <div className={`border rounded-lg p-4 shadow-sm ${localTask.completed ? 'bg-gray-50' : ''}`}>
      <div className="flex items-start gap-3">
        <TaskCheckbox 
          taskId={localTask.id} 
          completed={localTask.completed}
          onToggle={(completed) => setLocalTask({...localTask, completed})}
        />
        <div className="flex-1">
          <h3 className={`font-medium ${localTask.completed ? 'line-through text-gray-500' : ''}`}>
            {localTask.title}
          </h3>
          {localTask.description && (
            <p className="mt-1 text-gray-600">{localTask.description}</p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            Created: {new Date(localTask.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### AddTaskForm Component
**Purpose**: Form for creating new tasks  
**Type**: Client Component  
**Props**: None  
**State Management**: useState for form fields  
**API Calls**: POST /api/{user_id}/tasks  
**Styling Approach**: Tailwind CSS with form layout  
**Accessibility**: Proper form labels, error messages, keyboard navigation

**Example Code**:
```tsx
// frontend/components/AddTaskForm.tsx
'use client';
import { useState } from 'react';
import { createTask } from '@/lib/tasks';
import { useRouter } from 'next/navigation';

export default function AddTaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      await createTask({ title, description });
      setTitle('');
      setDescription('');
      setError('');
      router.refresh(); // Refresh to update task list
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
      <div className="mb-3">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter task title"
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter task description (optional)"
          rows={3}
        />
      </div>
      
      {error && (
        <div className="mb-3 text-red-600 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Task
      </button>
    </form>
  );
}
```

### TaskCheckbox Component
**Purpose**: Toggle task completion status  
**Type**: Client Component  
**Props**: taskId (number), completed (boolean), onToggle (callback)  
**State Management**: useState for optimistic updates  
**API Calls**: PATCH /api/{user_id}/tasks/{id}/complete  
**Styling Approach**: Tailwind CSS with checkbox styling  
**Accessibility**: Proper checkbox labeling, keyboard support

**Example Code**:
```tsx
// frontend/components/TaskCheckbox.tsx
'use client';
import { useState } from 'react';
import { updateTaskCompletion } from '@/lib/tasks';

interface TaskCheckboxProps {
  taskId: number;
  completed: boolean;
  onToggle: (completed: boolean) => void;
}

export default function TaskCheckbox({ taskId, completed, onToggle }: TaskCheckboxProps) {
  const [isChecked, setIsChecked] = useState(completed);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async () => {
    const newValue = !isChecked;
    setIsUpdating(true);
    
    // Optimistic update
    setIsChecked(newValue);
    onToggle(newValue);
    
    try {
      await updateTaskCompletion(taskId, newValue);
    } catch (error) {
      // Rollback on error
      setIsChecked(!newValue);
      onToggle(!newValue);
      console.error('Failed to update task completion:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={handleChange}
      disabled={isUpdating}
      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
      aria-label={isChecked ? "Mark as incomplete" : "Mark as complete"}
    />
  );
}
```

### Navbar Component
**Purpose**: Navigation with logout functionality  
**Type**: Client Component  
**Props**: None  
**State Management**: None (uses auth context)  
**API Calls**: Logout endpoint  
**Styling Approach**: Tailwind CSS with flex layout  
**Accessibility**: Proper navigation landmarks, keyboard support

**Example Code**:
```tsx
// frontend/components/Navbar.tsx
'use client';
import { signOut } from 'better-auth/client';
import Link from 'next/link';

export default function Navbar() {
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/'; // Redirect to home after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              Todo App
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

## Styling Guidelines
- Use Tailwind CSS utility classes exclusively
- Follow consistent spacing with Tailwind's scale (px-4, py-2, etc.)
- Use consistent color palette (indigo for primary actions, red for destructive)
- Maintain consistent typography (font sizes, weights, line heights)
- Implement responsive design with mobile-first approach

## Responsive Behavior
- Mobile: Single column layout, stacked elements
- Tablet: Two-column layout where appropriate
- Desktop: Multi-column layout with efficient use of space
- All interactive elements have appropriate touch targets (>44px)

## Accessibility Requirements
- All interactive elements have proper ARIA labels
- Keyboard navigation support for all functionality
- Sufficient color contrast ratios
- Semantic HTML elements
- Screen reader compatibility

## Error Handling
- Form validation with clear error messages
- Loading states for all async operations
- Error boundaries for component-level errors
- User-friendly error messages

*Last Updated: 2026-01-24*
*Status: Ready*