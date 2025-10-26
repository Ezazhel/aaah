import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from './api-client';
import type { User, AuthResponse, LoginCredentials } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (token && storedUser) {
      try {
        // Parse stored user
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);

        // Optionally verify token validity with API
        // This is a good practice to ensure the token is still valid
        try {
          const response = await apiClient.get<User>('/auth/me');
          setUser(response as unknown as User);
          localStorage.setItem('auth_user', JSON.stringify(response));
        } catch {
          // If verification fails, clear auth state
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setUser(null);
        }
      } catch {
        // If parsing fails, clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const authResponse = response as unknown as AuthResponse;

      // Store token and user
      localStorage.setItem('auth_token', authResponse.token);
      localStorage.setItem('auth_user', JSON.stringify(authResponse.user));

      // Set remember me duration (30 days if checked, session only otherwise)
      if (credentials.rememberMe) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        localStorage.setItem('auth_expires_at', expiresAt.toISOString());
      }

      setUser(authResponse.user);
      return authResponse;
    } catch (error) {
      throw error;
    }
  };

  const logout = useCallback(() => {
    // Clear auth state
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expires_at');
    setUser(null);
  }, []);

  const refreshUser = async () => {
    try {
      const response = await apiClient.get<User>('/auth/me');
      const updatedUser = response as unknown as User;
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    setUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
