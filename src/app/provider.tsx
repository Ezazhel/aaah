/**
 * React providers wrapper
 * This file contains all React context providers (theme, auth, query client, etc.)
 * Centralizes provider setup to keep the main app component clean
 */
import type { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      {/* Add future providers here (theme, auth, query client, etc.) */}
      {children}
    </>
  );
};