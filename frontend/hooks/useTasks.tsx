'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/api';
import { Task } from '@/types/task';
import { toast } from 'sonner';

// Helper function to safely access localStorage
const getLocalStorageItem = (key: string, defaultValue: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

const setLocalStorageItem = (key: string, value: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(key, value);
  }
};

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  deletedCount: number;
  recentlyUpdatedTaskId: number | string | null;
  toggleTaskCompletion: (taskId: string | number) => Promise<void>;
  deleteTask: (taskId: string | number) => Promise<void>;
  updateTask: (taskId: string | number, data: Partial<Task>) => Promise<void>;
  refetch: () => Promise<void>;
  fetchTaskSubtasks: (taskId: number) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletedCount, setDeletedCount] = useState(0);
  const [recentlyUpdatedTaskId, setRecentlyUpdatedTaskId] = useState<number | string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Initialize the deleted count from localStorage when component mounts
  useEffect(() => {
    if (user?.id) {
      const userDeletedTasksKey = `deletedTasksCount_${user.id}`;
      const savedCount = parseInt(getLocalStorageItem(userDeletedTasksKey, '0'), 10);
      setDeletedCount(savedCount);
    }
  }, [user?.id]);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    setLoading(true);
    try {
      const response = await apiService.tasks.getAll(user.id);
      if (response.data) setTasks(response.data);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      // Check if it's an auth error (403) and handle accordingly
      if (error.response?.status === 403) {
        toast.error('Session expired. Please log in again.');
        // The auth context should automatically handle the token cleanup
      } else {
        toast.error('Failed to sync tasks');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // ✅ FIXED Toggle: Yeh sirf task ka status badlega, "Updated" badge trigger nahi karega
  const toggleTaskCompletion = async (taskId: number | string) => {
    if (!user?.id) return;
    try {
      const id = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
      await apiService.tasks.toggleComplete(id, true, user.id);

      setTasks(prev => prev.map(t => {
        const taskIdInState = typeof t.id === 'string' ? parseInt(t.id, 10) : t.id;
        // Sirf completed status badlein, updated_at ko manually na chherain
        return taskIdInState === id ? { ...t, completed: !t.completed } : t;
      }));
      toast.success('Status updated');
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Sync failed');
      }
    }
  };

  // ✅ Delete Logic: Isey bilkul nahi chhera gaya, persistence ok hai
  const deleteTask = async (taskId: number | string) => {
    if (!user?.id) return;
    try {
      const idToDelete = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
      await apiService.tasks.delete(idToDelete, user.id);

      setTasks(prev => prev.filter(t => {
        const taskIdInState = typeof t.id === 'string' ? parseInt(t.id, 10) : t.id;
        return taskIdInState !== idToDelete;
      }));

      const newDeletedCount = deletedCount + 1;
      const userDeletedTasksKey = `deletedTasksCount_${user?.id || 'unknown'}`;
      setLocalStorageItem(userDeletedTasksKey, newDeletedCount.toString());
      setDeletedCount(newDeletedCount);

      toast.success('Task removed');
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Could not delete task');
      }
    }
  };

  // ✅ Update Logic: Is ke zariye backend se naya updated_at aayega aur badge show hoga
  const updateTask = async (taskId: number | string, data: Partial<Task>) => {
    if (!user?.id) return;
    try {
      const idToUpdate = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
      // Prepare data to handle optional due_date properly
      const preparedData = { ...data };
      if (preparedData.due_date === '') {
        preparedData.due_date = undefined;
      }

      const response = await apiService.tasks.update(idToUpdate, preparedData, user.id);

      setTasks(prev => prev.map(t => {
        const taskIdInState = typeof t.id === 'string' ? parseInt(t.id, 10) : t.id;
        // Backend response se pura naya data lein (jisme naya timestamp hoga)
        return taskIdInState === idToUpdate ? response.data : t;
      }));

      // Set the recently updated task ID to highlight the card
      setRecentlyUpdatedTaskId(taskId);
      console.log('Setting recently updated task ID:', taskId); // Debug log

      // Clear the recently updated task ID after 3 seconds
      setTimeout(() => {
        setRecentlyUpdatedTaskId(null);
        console.log('Cleared recently updated task ID'); // Debug log
      }, 3000);

      toast.success('Task updated');
    } catch (error: any) {
      console.error('Update error:', error); // Debug log
      if (error.response?.status === 403) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to update task');
      }
    }
  };

  const fetchTaskSubtasks = async (taskId: number) => {
    try {
      const response = await apiService.tasks.getSubtasks(taskId, user?.id);
      setTasks(prev => prev.map(task => {
        const tid = typeof task.id === 'string' ? parseInt(task.id, 10) : task.id;
        return tid === taskId ? { ...task, subtasks: response.data || [] } : task;
      }));
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Session expired. Please log in again.');
      } else {
        console.error('Subtasks error:', error);
      }
    }
  };

  useEffect(() => {
    // Only fetch tasks when user is authenticated and user ID is available
    if (isAuthenticated && user?.id) {
      // Add a slightly longer delay to ensure token is available in localStorage
      const timer = setTimeout(fetchTasks, 800);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user?.id, fetchTasks]);

  // Return the current deletedCount from state
  return { tasks, loading, deletedCount, recentlyUpdatedTaskId, toggleTaskCompletion, deleteTask, updateTask, refetch: fetchTasks, fetchTaskSubtasks };
};