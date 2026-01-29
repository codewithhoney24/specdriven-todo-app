/**
 * Custom auth client setup for the Todo Application frontend.
 *
 * This module provides authentication functionality using custom backend endpoints.
 */

import { useState, useEffect } from 'react';

// Define types for user and auth response
interface User {
  id: string;
  email: string;
  name: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface UserRegistration {
  email: string;
  password: string;
  name: string;
}

interface UserLogin {
  email: string;
  password: string;
}

// Base API URL - handle both local and deployed environments properly
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.endsWith('/api')
    ? process.env.NEXT_PUBLIC_API_URL.slice(0, -4) // Remove trailing '/api'
    : process.env.NEXT_PUBLIC_API_URL
  : typeof window !== 'undefined'
    ? window.location.origin  // Use current origin in browser
    : "http://localhost:8000";  // Fallback for SSR

// Auth API functions
export const authAPI = {
  async signUp(userData: UserRegistration): Promise<{ user?: User; error?: { message: string } }> {
    try {
      console.log(`Attempting to register user at: ${API_BASE_URL}/api/auth/register`); // Debug log
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
        throw new Error(errorData.detail || 'Registration failed');
      }

      const responseUserData = await response.json();

      // Create a user object with the correct format
      const user: User = {
        id: responseUserData.id,  // Use the ID returned by the backend
        email: responseUserData.email,
        name: responseUserData.name
      };

      // After successful registration, typically you'd redirect to login
      // For now, we'll return the user data
      return { user };
    } catch (error: any) {
      console.error('Registration error:', error);
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { error: { message: 'Network error: Unable to connect to the server. Please check your connection and try again.' } };
      }
      return { error: { message: error.message || 'Registration failed' } };
    }
  },

  async signIn(credentials: UserLogin): Promise<{ user?: User; token?: string; error?: { message: string } }> {
    try {
      console.log(`Attempting to login user at: ${API_BASE_URL}/api/auth/login`); // Debug log
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(errorData.detail || 'Login failed');
      }

      const data: TokenResponse = await response.json();

      // Store token in localStorage
      localStorage.setItem('auth-token', data.access_token);

      // Decode the token to get user info
      const tokenParts = data.access_token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Decode the payload (second part of the JWT)
      // JWT payloads need to be base64url decoded, not standard base64
      const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Pad with '=' if needed
      const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      const payload = JSON.parse(atob(paddedBase64));

      console.log('Decoded token payload:', payload); // Debug log

      // Create and return user object
      const user: User = {
        id: payload.sub,  // Use the subject (sub) field from the token as the user ID
        email: payload.email,
        name: payload.name || credentials.email.split('@')[0] // Use email prefix as name if not in token
      };

      return { user, token: data.access_token };
    } catch (error: any) {
      console.error('Login error:', error);
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { error: { message: 'Network error: Unable to connect to the server. Please check your connection and try again.' } };
      }
      return { error: { message: error.message || 'Login failed' } };
    }
  },

  async signOut(): Promise<void> {
    // Clear stored token/session
    localStorage.removeItem('auth-token');
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      return null;
    }

    try {
      // First, try to get updated user data from the backend
      try {
        console.log(`Attempting to get current user at: ${API_BASE_URL}/api/users/me`); // Debug log
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('getCurrentUser - Retrieved from backend:', userData); // Debug log

          // Return user data from backend (which has the most up-to-date info)
          return {
            id: userData.id,
            email: userData.email,
            name: userData.name
          };
        } else {
          // If backend call fails, fall back to decoding the token
          console.warn('Failed to fetch user from backend, falling back to token');
        }
      } catch (fetchError) {
        // If fetch fails completely (network error, etc.), fall back to decoding the token
        console.warn('Network error fetching user from backend, falling back to token', fetchError);
      }

      // Decode JWT token to get user info
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Invalid token format');
        return null;
      }

      // Decode the payload (second part of the JWT)
      // JWT payloads need to be base64url decoded, not standard base64
      const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Pad with '=' if needed
      const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      const payload = JSON.parse(atob(paddedBase64));

      console.log('getCurrentUser - Decoded token payload:', payload); // Debug log

      // Create a user object from the decoded token
      // The token contains: { "sub": userId, "email": userEmail, "exp": expiration }
      return {
        id: payload.sub,  // Use the subject (sub) field from the token as the user ID
        email: payload.email,
        name: payload.name || payload.email?.split('@')[0] || 'User' // Use email prefix as name if not in token
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      localStorage.removeItem('auth-token');
      return null;
    }
  }
};

// Custom hook for session management
export function useSession() {
  const [data, setData] = useState<{ user: User } | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      setIsPending(true);
      const user = await authAPI.getCurrentUser();
      if (user) {
        setData({ user });
      }
      setIsPending(false);
    };

    fetchSession();
  }, []);

  const refetch = async () => {
    setIsRefetching(true);
    const user = await authAPI.getCurrentUser();
    if (user) {
      setData({ user });
    }
    setIsRefetching(false);
  };

  return { data, isPending, isRefetching, refetch };
}

// Export the auth API functions
export const signIn = authAPI.signIn;
export const signOut = authAPI.signOut;

// Export the auth client as authClient for backward compatibility
export const authClient = authAPI;

// Export getAuthToken function for API requests
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem('auth-token');
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Export a function to get the current user ID from the token
export const getCurrentUserId = (): string | null => {
  try {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      return null;
    }

    // Decode the token to get user info
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid token format');
      return null;
    }

    // Decode the payload (second part of the JWT)
    const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const payload = JSON.parse(atob(paddedBase64));

    return payload.sub || null;
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return null;
  }
};