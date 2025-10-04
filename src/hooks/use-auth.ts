'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useUser } from '@/firebase/provider';
import { AuthService, UserProfile } from '@/firebase/auth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

export function useAuth(): AuthContextType {
  const { user, isUserLoading } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && !userProfile) {
        try {
          const profile = await AuthService.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
      } else if (!user) {
        setUserProfile(null);
      }
    };

    loadUserProfile();
  }, [user, userProfile]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await AuthService.signIn(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    try {
      await AuthService.signUp(email, password, displayName);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AuthService.signOut();
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (!user) return;
    try {
      const profile = await AuthService.getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  };

  return {
    user,
    userProfile,
    isLoading: isUserLoading || isLoading,
    signIn,
    signUp,
    signOut,
    refreshUserProfile,
  };
}