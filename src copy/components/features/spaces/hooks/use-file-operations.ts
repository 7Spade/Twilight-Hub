/**
 * @fileoverview Firebase 文件操作 Hook
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 位置: 客戶端組件中的 Firebase 操作
 */

'use client';

import { useState, useCallback } from 'react';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll, 
  getMetadata 
} from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps } from 'firebase/app';

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

export interface FileItem {
  name: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
}

export interface UploadResult {
  success: boolean;
  downloadURL?: string;
  fileName?: string;
  size?: number;
  contentType?: string;
  error?: string;
}

export interface DownloadResult {
  success: boolean;
  downloadURL?: string;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ListResult {
  success: boolean;
  files?: FileItem[];
  error?: string;
}

export function useFileOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: File,
    spaceId: string,
    userId: string
  ): Promise<UploadResult> => {
    setLoading(true);
    setError(null);

    try {
      if (!file || !spaceId || !userId) {
        throw new Error('Missing required fields');
      }

      // Create storage reference
      const storageRef = ref(storage, `spaces/${spaceId}/${userId}/${file.name}`);
      
      // Convert file to buffer
      const buffer = await file.arrayBuffer();
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, buffer, {
        contentType: file.type,
      });

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        success: true,
        downloadURL,
        fileName: file.name,
        size: file.size,
        contentType: file.type,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadFile = useCallback(async (
    spaceId: string,
    userId: string,
    fileName: string
  ): Promise<DownloadResult> => {
    setLoading(true);
    setError(null);

    try {
      if (!spaceId || !userId || !fileName) {
        throw new Error('Missing required fields');
      }

      // Create storage reference
      const storageRef = ref(storage, `spaces/${spaceId}/${userId}/${fileName}`);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      return {
        success: true,
        downloadURL,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (
    spaceId: string,
    userId: string,
    fileName: string
  ): Promise<DeleteResult> => {
    setLoading(true);
    setError(null);

    try {
      if (!spaceId || !userId || !fileName) {
        throw new Error('Missing required fields');
      }

      // Create storage reference
      const storageRef = ref(storage, `spaces/${spaceId}/${userId}/${fileName}`);
      
      // Delete file
      await deleteObject(storageRef);

      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const listFiles = useCallback(async (
    spaceId: string,
    userId: string
  ): Promise<ListResult> => {
    setLoading(true);
    setError(null);

    try {
      if (!spaceId || !userId) {
        throw new Error('Missing required parameters');
      }

      // Create storage reference to the user's folder in the space
      const storageRef = ref(storage, `spaces/${spaceId}/${userId}`);
      
      // List all files
      const result = await listAll(storageRef);
      
      // Get metadata for each file
      const files = await Promise.all(
        result.items.map(async (item) => {
          const metadata = await getMetadata(item);
          return {
            name: item.name,
            size: metadata.size,
            contentType: metadata.contentType || 'application/octet-stream',
            timeCreated: metadata.timeCreated,
            updated: metadata.updated,
          };
        })
      );

      return {
        success: true,
        files,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to list files';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    uploadFile,
    downloadFile,
    deleteFile,
    listFiles,
  };
}
