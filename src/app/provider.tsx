/**
 * React providers wrapper
 * This file contains all React context providers (theme, auth, query client, etc.)
 * Centralizes provider setup to keep the main app component clean
 */
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { queryClient } from '@/lib/react-query';
import { AuthProvider } from '@/lib/auth';

interface AppProviderProps {
  children: ReactNode;
}


export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};