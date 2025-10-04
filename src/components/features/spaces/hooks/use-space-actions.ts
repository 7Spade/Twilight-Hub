import { useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { SpaceActions } from '../actions/space-actions';

export function useSpaceActions() {
  const { user } = useAuth();

  const createSpace = useCallback(async (spaceData: {
    name: string;
    description?: string;
    slug: string;
    organizationId?: string;
    isPublic: boolean;
  }) => {
    if (!user) throw new Error('用戶未登入');
    
    return await SpaceActions.createSpace({
      ...spaceData,
      ownerId: user.uid,
    });
  }, [user]);

  const updateSpace = useCallback(async (spaceId: string, updates: Parameters<typeof SpaceActions.updateSpace>[1]) => {
    if (!user) throw new Error('用戶未登入');
    return await SpaceActions.updateSpace(spaceId, updates);
  }, [user]);

  const deleteSpace = useCallback(async (spaceId: string) => {
    if (!user) throw new Error('用戶未登入');
    return await SpaceActions.deleteSpace(spaceId);
  }, [user]);

  const joinSpace = useCallback(async (spaceId: string) => {
    if (!user) throw new Error('用戶未登入');
    return await SpaceActions.joinSpace(spaceId, user.uid);
  }, [user]);

  const leaveSpace = useCallback(async (spaceId: string) => {
    if (!user) throw new Error('用戶未登入');
    return await SpaceActions.leaveSpace(spaceId, user.uid);
  }, [user]);

  return {
    createSpace,
    updateSpace,
    deleteSpace,
    joinSpace,
    leaveSpace,
  };
}
