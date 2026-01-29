/**
 * Type definitions for Task in the Todo Application.
 */

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string; // Task category/tag
  due_date?: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  subtasks?: Subtask[]; // Array of subtasks
}

export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}