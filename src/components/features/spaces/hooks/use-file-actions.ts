import { useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { FileActions } from '../actions/file-actions';

export function useFileActions() {
  const { user } = useAuth();

  const uploadFile = useCallback(async (
    file: File,
    spaceId: string,
    path?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) throw new Error('用戶未登入');
    
    return await FileActions.uploadFile(file, spaceId, path, {
      ...metadata,
      uploadedBy: user.uid,
      uploadedAt: new Date().toISOString(),
    });
  }, [user]);

  const deleteFile = useCallback(async (fileId: string, spaceId: string) => {
    if (!user) throw new Error('用戶未登入');
    return await FileActions.deleteFile(fileId, spaceId);
  }, [user]);

  const renameFile = useCallback(async (fileId: string, newName: string) => {
    if (!user) throw new Error('用戶未登入');
    return await FileActions.renameFile(fileId, newName);
  }, [user]);

  const moveFile = useCallback(async (fileId: string, newPath: string) => {
    if (!user) throw new Error('用戶未登入');
    return await FileActions.moveFile(fileId, newPath);
  }, [user]);

  const getFileDownloadUrl = useCallback(async (filePath: string) => {
    if (!user) throw new Error('用戶未登入');
    return await FileActions.getFileDownloadUrl(filePath);
  }, [user]);

  return {
    uploadFile,
    deleteFile,
    renameFile,
    moveFile,
    getFileDownloadUrl,
  };
}
