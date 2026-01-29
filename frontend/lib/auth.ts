import { useState, useEffect } from 'react';

// --- Types ---
interface User {
  id: string;
  email: string;
  name: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

// --- API Configuration ---
// NEXT_PUBLIC_API_URL ko clean kiya gaya hai taake Vercel par error na aaye
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const cleanBaseUrl = API_BASE_URL.replace(/\/api$/, ''); 

export const authAPI = {
  // Signup Logic
  async signUp(userData: any): Promise<{ user?: User; error?: { message: string } }> {
    try {
      localStorage.removeItem('auth-token');
      const response = await fetch(`${cleanBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
        return { error: { message: errorData.detail || 'Registration failed' } };
      }
      const user = await response.json();
      return { user };
    } catch (err) {
      return { error: { message: "Network error. Please check your connection." } };
    }
  },

  // Login Logic (TypeScript Fix: Line 106-107 error solved)
  async signIn(credentials: any): Promise<{ user?: User; token?: string; error?: { message: string } }> {
    try {
      const response = await fetch(`${cleanBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
        return { error: { message: errorData.detail || 'Invalid credentials' } };
      }

      const data: TokenResponse = await response.json();
      localStorage.setItem('auth-token', data.access_token);
      
      // JWT Payload se user info nikalna
      const payload = JSON.parse(atob(data.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return { 
        user: { id: payload.sub, email: payload.email, name: payload.name }, 
        token: data.access_token 
      };
    } catch (err) {
      return { error: { message: "Server connection failed. Is the backend running?" } };
    }
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('auth-token');
    sessionStorage.clear();
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('auth-token');
    if (!token) return null;
    try {
      const response = await fetch(`${cleanBaseUrl}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) return response.json();
      
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return { id: payload.sub, email: payload.email, name: payload.name };
    } catch {
      return null;
    }
  }
};

// --- Session Hook ---
export function useSession() {
  const [data, setData] = useState<{ user: User } | null>(null);
  const [isPending, setIsPending] = useState(true);

  const fetchSession = async () => {
    setIsPending(true);
    const user = await authAPI.getCurrentUser();
    if (user) setData({ user });
    else setData(null);
    setIsPending(false);
  };

  useEffect(() => { fetchSession(); }, []);
  return { data, isPending, refetch: fetchSession };
}

export const authClient = authAPI;
export const signOut = authAPI.signOut;