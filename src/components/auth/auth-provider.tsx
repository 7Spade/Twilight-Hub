'use client';

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useUser } from '@/firebase/provider';

interface AuthContextType {
  user: any;
  isUserLoading: boolean;
  userError: Error | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading, userError } = useUser();

  const value: AuthContextType = {
    user,
    isUserLoading,
    userError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}