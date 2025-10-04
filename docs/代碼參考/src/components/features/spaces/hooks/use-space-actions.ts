/**
 * @fileoverview A custom hook for managing core space actions like create, update, and delete.
 * It encapsulates the logic for interacting with the Firestore database, including
 * data validation, state management (loading, error), and user feedback via toasts.
 * This centralizes the business logic for space management.
 */
'use client';

import { useState, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { type Space } from '@/lib/types-unified';
import { type SpaceSettingsFormValues } from '../components/spaces-settings-view';
import { spaceBaseSchema } from '../spaces-schemas';

interface CreateSpaceData {
  name: string;
  description: string;
  isPublic: boolean;
  ownerId: string;
}

interface UseSpaceActionsReturn {
  // Actions
  createSpace: (data: CreateSpaceData) => Promise<Space | null>;
  updateSpace: (spaceId: string, data: SpaceSettingsFormValues) => Promise<boolean>;
  deleteSpace: (spaceId: string) => Promise<boolean>;
  
  // State
  isLoading: boolean;
  error: string | null;
}

export function useSpaceActions(): UseSpaceActionsReturn {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }, []);

  const createSpace = useCallback(async (data: CreateSpaceData): Promise<Space | null> => {
    if (!firestore) {
      setError('Firestore not available');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validate data
      const validatedData = spaceBaseSchema.parse({
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
      });

      const spacesRef = collection(firestore, 'spaces');
      const newSpace = {
        ...validatedData,
        slug: generateSlug(data.name),
        ownerId: data.ownerId,
        ownerType: 'user' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        moduleIds: [],
        starredByUserIds: [],
      };

      const docRef = await addDoc(spacesRef, newSpace);
      
      toast({
        title: 'Success!',
        description: `Space "${data.name}" has been created.`,
      });

      return {
        id: docRef.id,
        ...newSpace,
      } as Space;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create space';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Failed to create space',
        description: errorMessage,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, generateSlug, toast]);

  const updateSpace = useCallback(async (
    spaceId: string, 
    data: SpaceSettingsFormValues
  ): Promise<boolean> => {
    if (!firestore) {
      setError('Firestore not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validate data
      const validatedData = spaceBaseSchema.parse(data);

      const spaceRef = doc(firestore, 'spaces', spaceId);
      await updateDoc(spaceRef, {
        ...validatedData,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Success!',
        description: 'Space settings have been updated.',
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update space';
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

  const deleteSpace = useCallback(async (spaceId: string): Promise<boolean> => {
    if (!firestore) {
      setError('Firestore not available');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const spaceRef = doc(firestore, 'spaces', spaceId);
      await deleteDoc(spaceRef);

      toast({
        title: 'Success!',
        description: 'Space has been deleted.',
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete space';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, toast]);

  return {
    createSpace,
    updateSpace,
    deleteSpace,
    isLoading,
    error,
  };
}
