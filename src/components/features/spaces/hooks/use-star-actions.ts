/**
 * @fileoverview A custom hook for handling the "starring" and "unstarring" of spaces.
 * It abstracts the Firestore logic for adding or removing a user's ID from a
 * space's `starredByUserIds` array, and manages the loading and error states
 * for these actions.
 */
'use client';

import { useState, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
// TODO: [P0] VAN - 移除未使用的類型導入
// 問題：import { type Space as _Space } from '@/lib/types-unified'; 完全未使用
// 解決方案：直接移除該導入語句
// 現代化建議：使用 ESLint no-unused-vars 規則自動檢測
// 效能影響：減少 bundle 大小，降低認知負擔

interface UseStarActionsReturn {
  // Actions
  starSpace: (spaceId: string, userId: string) => Promise<boolean>;
  unstarSpace: (spaceId: string, userId: string) => Promise<boolean>;
  toggleStar: (spaceId: string, userId: string, isStarred: boolean) => Promise<boolean>;
  
  // State
  isLoading: boolean;
  error: string | null;
}

export function useStarActions(): UseStarActionsReturn {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const starSpace = useCallback(async (spaceId: string, userId: string): Promise<boolean> => {
    if (!firestore) {
      setError('Firestore not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const spaceRef = doc(firestore, 'spaces', spaceId);
      await updateDoc(spaceRef, {
        starredByUserIds: arrayUnion(userId),
      });

      toast({
        title: 'Success!',
        description: 'Space has been starred.',
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to star space';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Failed to star space',
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, toast]);

  const unstarSpace = useCallback(async (spaceId: string, userId: string): Promise<boolean> => {
    if (!firestore) {
      setError('Firestore not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const spaceRef = doc(firestore, 'spaces', spaceId);
      await updateDoc(spaceRef, {
        starredByUserIds: arrayRemove(userId),
      });

      toast({
        title: 'Success!',
        description: 'Space has been unstarred.',
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unstar space';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Failed to unstar space',
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, toast]);

  const toggleStar = useCallback(async (
    spaceId: string, 
    userId: string, 
    isStarred: boolean
  ): Promise<boolean> => {
    if (isStarred) {
      return await unstarSpace(spaceId, userId);
    } else {
      return await starSpace(spaceId, userId);
    }
  }, [starSpace, unstarSpace]);

  return {
    starSpace,
    unstarSpace,
    toggleStar,
    isLoading,
    error,
  };
}
