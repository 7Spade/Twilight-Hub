/**
 * @fileoverview A custom hook for managing the visibility of a space (public/private).
 * It provides functions to toggle, set to public, or set to private, abstracting
 * the Firestore update logic and managing loading and error states.
 */
'use client';

import { useState, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface UseVisibilityActionsReturn {
  // Actions
  toggleVisibility: (spaceId: string, isPublic: boolean) => Promise<boolean>;
  setPublic: (spaceId: string) => Promise<boolean>;
  setPrivate: (spaceId: string) => Promise<boolean>;
  
  // State
  isLoading: boolean;
  error: string | null;
}

export function useVisibilityActions(): UseVisibilityActionsReturn {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleVisibility = useCallback(async (
    spaceId: string, 
    isPublic: boolean
  ): Promise<boolean> => {
    if (!firestore) {
      setError('Firestore not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const spaceRef = doc(firestore, 'spaces', spaceId);
      await updateDoc(spaceRef, {
        isPublic: !isPublic,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Success!',
        description: `Space is now ${!isPublic ? 'public' : 'private'}.`,
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update visibility';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, toast]);

  const setPublic = useCallback(async (spaceId: string): Promise<boolean> => {
    if (!firestore) {
      setError('Firestore not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const spaceRef = doc(firestore, 'spaces', spaceId);
      await updateDoc(spaceRef, {
        isPublic: true,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Success!',
        description: 'Space is now public.',
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set space as public';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, toast]);

  const setPrivate = useCallback(async (spaceId: string): Promise<boolean> => {
    if (!firestore) {
      setError('Firestore not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const spaceRef = doc(firestore, 'spaces', spaceId);
      await updateDoc(spaceRef, {
        isPublic: false,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Success!',
        description: 'Space is now private.',
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set space as private';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, toast]);

  return {
    toggleVisibility,
    setPublic,
    setPrivate,
    isLoading,
    error,
  };
}
