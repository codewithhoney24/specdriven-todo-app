'use client';

import axios from 'axios';
import { Task } from '@/types/task';

// Helper function to get token with delay
const getTokenWithDelay = async (): Promise<string | null> => {
  // Wait briefly to ensure token is available in localStorage
  await new Promise(resolve => setTimeout(resolve, 100));
  return localStorage.getItem('auth-token');
};

// Helper function to extract user ID from token
const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('auth-token');
  if (!token) return null;

  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return null;
    const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const payload = JSON.parse(atob(paddedBase64));
    return payload.sub || null;
  } catch (e) {
    console.error('Error extracting user ID from token:', e);
    return null;
  }
};

// Helper function to handle API errors
const handleApiError = (error: any) => {
  // If we get a 401 or 403 error, it might be due to an invalid/expired token
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.log(`Received ${error.response?.status} error, clearing token and suggesting re-authentication`);
    // Clear the token to force re-login
    localStorage.removeItem('auth-token');

    // Also clear any related auth state
    if (typeof window !== 'undefined') {
      // Trigger a global event to notify other parts of the app
      window.dispatchEvent(new Event('auth-error'));
    }
  }
  throw error; // Re-throw the error to be handled by the caller
};

// Define the base API service with proper endpoints
const apiService = {
  tasks: {
    // Get all tasks for the authenticated user
    getAll: async (userId?: string) => {
      const token = await getTokenWithDelay();

      // Always get user ID from token to ensure we're accessing the correct user's data
      const tokenUserId = getUserIdFromToken();
      if (!tokenUserId) {
        throw new Error('User ID is required to get tasks');
      }
      const cleanUserId = tokenUserId.trim();

      console.log('Making API call to get tasks for user:', cleanUserId); // Debug log
      console.log('Using token:', token ? 'Present' : 'Missing'); // Debug log

      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/${cleanUserId}/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        return response;
      } catch (error: any) {
        return handleApiError(error);
      }
    },
    
    getById: async (id: number, userId?: string) => {
      const token = await getTokenWithDelay();

      // Always get user ID from token to ensure we're accessing the correct user's data
      const tokenUserId = getUserIdFromToken();
      if (!tokenUserId) {
        throw new Error('User ID is required to get a task');
      }
      const cleanUserId = tokenUserId.trim();

      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      try {
        return await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/${cleanUserId}/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        return handleApiError(error);
      }
    },
    
    create: async (taskData: Partial<Task>, userId?: string) => {
      const token = await getTokenWithDelay();

      // Always get user ID from token to ensure we're accessing the correct user's data
      const tokenUserId = getUserIdFromToken();
      if (!tokenUserId) {
        throw new Error('User ID is required to create a task');
      }
      const cleanUserId = tokenUserId.trim();

      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      try {
        return await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/${cleanUserId}/tasks`, taskData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        return handleApiError(error);
      }
    },
    
    update: async (id: number, taskData: Partial<Task>, userId?: string) => {
      const token = await getTokenWithDelay();

      // Always get user ID from token to ensure we're accessing the correct user's data
      const tokenUserId = getUserIdFromToken();
      if (!tokenUserId) {
        throw new Error('User ID is required to update a task');
      }
      const cleanUserId = tokenUserId.trim();

      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      try {
        return await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/${cleanUserId}/tasks/${id}`, taskData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        return handleApiError(error);
      }
    },
    
    delete: async (id: number, userId?: string) => {
      const token = await getTokenWithDelay();

      // Always get user ID from token to ensure we're accessing the correct user's data
      const tokenUserId = getUserIdFromToken();
      if (!tokenUserId) {
        throw new Error('User ID is required to delete a task');
      }
      const cleanUserId = tokenUserId.trim();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/${cleanUserId}/tasks/${id}`;
      console.log(`Deleting task with URL: ${url}`);

      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      try {
        return await axios.delete(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        return handleApiError(error);
      }
    },
    
    toggleComplete: async (id: number, completed: boolean, userId?: string) => {
      const token = await getTokenWithDelay();

      // Always get user ID from token to ensure we're accessing the correct user's data
      const tokenUserId = getUserIdFromToken();
      if (!tokenUserId) {
        throw new Error('User ID is required to toggle task completion');
      }
      const cleanUserId = tokenUserId.trim();

      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      try {
        return await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/${cleanUserId}/tasks/${id}/complete`,
          { completed },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
      } catch (error: any) {
        return handleApiError(error);
      }
    },
    
    // Get subtasks for a specific task
    getSubtasks: async (taskId: number, userId?: string) => {
      const token = await getTokenWithDelay();

      // Always get user ID from token to ensure we're accessing the correct user's data
      const tokenUserId = getUserIdFromToken();
      if (!tokenUserId) {
        throw new Error('User ID is required to get subtasks');
      }
      const cleanUserId = tokenUserId.trim();

      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      try {
        return await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/${cleanUserId}/tasks/${taskId}/subtasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        return handleApiError(error);
      }
    },
  },
};

export { apiService };