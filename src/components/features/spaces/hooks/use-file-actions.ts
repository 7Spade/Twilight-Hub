/**
 * @fileoverview A custom hook for managing file-related actions.
 * It encapsulates the logic for calling server actions (upload, download, delete, list)
 * and manages the associated state, such as loading status, upload progress,
 * and errors. This simplifies file management logic in the UI components.
 */
'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  uploadFileAction, 
  downloadFileAction, 
  deleteFileAction, 
  listFilesAction,
  type FileActionItem 
} from '@/components/features/spaces/actions/file-actions';

interface UploadProgress {
  progress: number;
  fileName: string;
}

interface UseFileActionsReturn {
  // Actions
  uploadFile: (file: File, spaceId: string, userId: string) => Promise<boolean>;
  downloadFile: (fileName: string, spaceId: string, userId: string) => Promise<boolean>;
  deleteFile: (fileName: string, spaceId: string, userId: string) => Promise<boolean>;
  listFiles: (spaceId: string, userId: string) => Promise<FileActionItem[]>;
  
  // State
  isLoading: boolean;
  uploadProgress: UploadProgress | null;
  files: FileActionItem[];
  error: string | null;
}

export function useFileActions(): UseFileActionsReturn {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [files, setFiles] = useState<FileActionItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: File, 
    spaceId: string, 
    userId: string
  ): Promise<boolean> => {
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'File size must be less than 50MB',
      });
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      setUploadProgress({ progress: 0, fileName: file.name });

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => 
          prev ? { ...prev, progress: Math.min(prev.progress + 10, 90) } : null
        );
      }, 100);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('spaceId', spaceId);
      formData.append('userId', userId);

      const result = await uploadFileAction(formData);

      clearInterval(progressInterval);
      setUploadProgress(prev => prev ? { ...prev, progress: 100 } : null);

      if (result.success) {
        toast({
          title: 'Success',
          description: 'File uploaded successfully',
        });
        return true;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
      setUploadProgress(null);
    }
  }, [toast]);

  const downloadFile = useCallback(async (
    fileName: string, 
    spaceId: string, 
    userId: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await downloadFileAction(spaceId, userId, fileName);

      if (result.success && result.downloadURL) {
        // Open download URL in new tab
        window.open(result.downloadURL, '_blank');
        return true;
      } else {
        throw new Error(result.error || 'Download failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download file';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteFile = useCallback(async (
    fileName: string, 
    spaceId: string, 
    userId: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await deleteFileAction(spaceId, userId, fileName);

      if (result.success) {
        toast({
          title: 'Success',
          description: 'File deleted successfully',
        });
        return true;
      } else {
        throw new Error(result.error || 'Delete failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const listFiles = useCallback(async (
    spaceId: string,
    userId: string
  ): Promise<FileActionItem[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await listFilesAction(spaceId, userId);
      
      if (result.success && result.files) {
        setFiles(result.files);
        return result.files;
      } else {
        throw new Error(result.error || 'Failed to load files');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load files';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    listFiles,
    isLoading,
    uploadProgress,
    files,
    error,
  };
}
