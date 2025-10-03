/**
 * 文件操作相關 hooks
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 提供文件上傳、下載、管理功能
 * 位置: src/hooks/use-file-operations.ts
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getSdks } from '@/firebase';
import { ContractDocument } from '@/lib/types/contract.types';

/**
 * 上傳文件到 Firebase Storage
 */
export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      path,
      userId,
      userName,
      userEmail,
    }: {
      file: File;
      path: string;
      userId: string;
      userName: string;
      userEmail: string;
    }) => {
      const { storage } = getSdks();
      
      // 生成唯一文件名
      const timestamp = Date.now();
      const fileName = `${path}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);

      // 上傳文件
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 創建文檔記錄
      const document: ContractDocument = {
        id: `doc_${timestamp}`,
        name: file.name,
        url: downloadURL,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        uploadedBy: {
          id: userId,
          name: userName,
          email: userEmail,
        },
      };

      return document;
    },
    onSuccess: (document, variables) => {
      // 更新文檔列表緩存
      queryClient.setQueryData(['documents', variables.path], (old: ContractDocument[] = []) => [
        ...old,
        document,
      ]);
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
    },
  });
}

/**
 * 刪除文件
 */
export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      document,
      path,
    }: {
      document: ContractDocument;
      path: string; /* TODO: [P2] [CLEANUP] [UI] [TODO] 清理未使用的參數 - path 未使用 */
    }) => {
      const { storage } = getSdks();
      
      // 從 Firebase Storage 刪除文件
      const fileRef = ref(storage, document.url);
      await deleteObject(fileRef);

      return document.id;
    },
    onSuccess: (documentId, variables) => {
      // 從緩存中移除文檔
      queryClient.setQueryData(['documents', variables.path], (old: ContractDocument[] = []) =>
        old.filter(doc => doc.id !== documentId)
      );
    },
    onError: (error) => {
      console.error('Error deleting file:', error);
    },
  });
}

/**
 * 獲取文件列表
 */
export function useDocuments(path: string) {
  return useQuery({
    queryKey: ['documents', path],
    queryFn: async () => {
      // 這裡應該從 Firebase 獲取文檔列表
      // 暫時返回空數組
      return [] as ContractDocument[];
    },
    enabled: !!path,
    staleTime: 5 * 60 * 1000, // 5分鐘緩存
  });
}

/**
 * 下載文件
 */
export function useDownloadFile() {
  return useMutation({
    mutationFn: async ({
      document,
    }: {
      document: ContractDocument;
    }) => {
      // 創建下載鏈接
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      link.target = '_blank';
      
      // 觸發下載
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: (error) => {
      console.error('Error downloading file:', error);
    },
  });
}

/**
 * 預覽文件
 */
export function usePreviewFile() {
  return useMutation({
    mutationFn: async ({
      document,
    }: {
      document: ContractDocument;
    }) => {
      // 在新窗口中打開文件
      window.open(document.url, '_blank');
    },
    onError: (error) => {
      console.error('Error previewing file:', error);
    },
  });
}

/**
 * 獲取文件類型圖標
 */
export function useFileTypeIcon(fileName: string) {
  const getFileType = (name: string) => {
    const extension = name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'file-text';
      case 'doc':
      case 'docx':
        return 'file-text';
      case 'xls':
      case 'xlsx':
        return 'file-spreadsheet';
      case 'ppt':
      case 'pptx':
        return 'file-presentation';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'file-image';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'file-video';
      case 'mp3':
      case 'wav':
        return 'file-audio';
      case 'zip':
      case 'rar':
        return 'file-archive';
      default:
        return 'file';
    }
  };

  return getFileType(fileName);
}

/**
 * 格式化文件大小
 */
export function useFormatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 檢查文件類型是否支持
 */
export function useIsFileTypeSupported(fileName: string) {
  const supportedTypes = [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov',
    'mp3', 'wav', 'zip', 'rar', 'txt'
  ];
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  return supportedTypes.includes(extension || '');
}

