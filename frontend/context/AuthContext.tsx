// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signOut, authAPI } from '@/lib/auth';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
    logout: async () => {},
    refetch: async () => {},
  });

  const { data: session, isPending, refetch } = useSession();

  // Effect to handle changes in localStorage for auth-token
  useEffect(() => {
    const handleStorageChange = () => {
      // When auth token is added/removed from localStorage, refetch session
      refetch();
    };

    // Listen for changes to auth-token in localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refetch]);

  useEffect(() => {
    // Always set loading to true when starting to fetch user data
    setAuthState(prev => ({
      ...prev,
      loading: true,
    }));

    if (isPending) {
      setAuthState(prev => ({
        ...prev,
        user: null,
        loading: true,
        isAuthenticated: false
      }));
    } else {
      // Check if we have a token in localStorage even if session is null
      const tokenExists = !!localStorage.getItem('auth-token');

      if (session?.user) {
        // If session has user data, use it
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          loading: false,
          isAuthenticated: !!session?.user,
        }));
      } else if (tokenExists) {
        // If there's a token but no session data, try to get user from token
        authAPI.getCurrentUser()
          .then(user => {
            setAuthState(prev => ({
              ...prev,
              user: user || null,
              loading: false,
              isAuthenticated: !!user,
            }));
          })
          .catch((error) => {
            console.error('Error getting current user:', error);
            setAuthState(prev => ({
              ...prev,
              user: null,
              loading: false,
              isAuthenticated: false,
            }));
          });
      } else {
        // No token, no session
        setAuthState(prev => ({
          ...prev,
          user: null,
          loading: false,
          isAuthenticated: false,
        }));
      }
    }
  }, [session, isPending, refetch]);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('auth-token'); // Also remove token from localStorage
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
        logout: handleLogout,
        refetch: () => Promise.resolve()
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to manually update auth state after login
  const updateAuthState = async () => {
    const currentUser = await authAPI.getCurrentUser();
    const isAuthenticated = !!currentUser;

    setAuthState({
      user: currentUser,
      loading: false,
      isAuthenticated,
      logout: handleLogout,
      refetch: () => Promise.resolve()
    });
  };

  // Update the logout function in state
  useEffect(() => {
    setAuthState(prev => ({
      ...prev,
      logout: handleLogout
    }));
  }, []);

  // Listen for auth-error events to handle token invalidation
  useEffect(() => {
    const handleAuthError = () => {
      // Clear the token and reset auth state when an auth error occurs
      localStorage.removeItem('auth-token');
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
        logout: handleLogout,
        refetch: () => Promise.resolve()
      });
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      loading: authState.loading,
      isAuthenticated: authState.isAuthenticated,
      logout: handleLogout,
      refetch: async () => {
        // Set loading state to true during refetch
        setAuthState(prev => ({
          ...prev,
          loading: true
        }));

        try {
          // Try to get the current user from the API using the stored token
          const user = await authAPI.getCurrentUser();

          setAuthState(prev => ({
            ...prev,
            user: user || null,
            loading: false,
            isAuthenticated: !!user,
            logout: handleLogout,
            refetch: prev.refetch
          }));
        } catch (error) {
          console.error('Error refetching user data:', error);
          // If refetch fails, clear the user data but maintain proper loading state
          setAuthState(prev => ({
            ...prev,
            user: null,
            loading: false,
            isAuthenticated: false,
            logout: handleLogout,
            refetch: prev.refetch
          }));
        }
        return Promise.resolve();
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};