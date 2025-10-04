import { useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { StarActions } from '../actions/star-actions';

export function useStarActions() {
  const { user } = useAuth();

  const starSpace = useCallback(async (spaceId: string) => {
    if (!user) throw new Error('用戶未登入');
    return await StarActions.starSpace(spaceId, user.uid);
  }, [user]);

  const unstarSpace = useCallback(async (spaceId: string) => {
    if (!user) throw new Error('用戶未登入');
    return await StarActions.unstarSpace(spaceId, user.uid);
  }, [user]);

  const isSpaceStarred = useCallback(async (spaceId: string) => {
    if (!user) return false;
    return await StarActions.isSpaceStarred(spaceId, user.uid);
  }, [user]);

  const getUserStarredSpaces = useCallback(async () => {
    if (!user) return [];
    return await StarActions.getUserStarredSpaces(user.uid);
  }, [user]);

  return {
    starSpace,
    unstarSpace,
    isSpaceStarred,
    getUserStarredSpaces,
  };
}
