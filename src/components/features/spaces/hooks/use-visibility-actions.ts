import { useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { VisibilityActions } from '../actions/visibility-actions';

export function useVisibilityActions() {
  const { user } = useAuth();

  const setSpacePublic = useCallback(async (spaceId: string) => {
    if (!user) throw new Error('用戶未登入');
    return await VisibilityActions.setSpacePublic(spaceId, user.uid);
  }, [user]);

  const setSpacePrivate = useCallback(async (spaceId: string) => {
    if (!user) throw new Error('用戶未登入');
    return await VisibilityActions.setSpacePrivate(spaceId, user.uid);
  }, [user]);

  const setSpaceRestricted = useCallback(async (spaceId: string, allowedUsers: string[]) => {
    if (!user) throw new Error('用戶未登入');
    return await VisibilityActions.setSpaceRestricted(spaceId, user.uid, allowedUsers);
  }, [user]);

  const checkAccessPermission = useCallback(async (spaceId: string) => {
    if (!user) return false;
    return await VisibilityActions.checkAccessPermission(spaceId, user.uid);
  }, [user]);

  return {
    setSpacePublic,
    setSpacePrivate,
    setSpaceRestricted,
    checkAccessPermission,
  };
}
