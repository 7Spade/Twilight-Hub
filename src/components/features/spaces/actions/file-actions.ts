import { FirestoreService } from '@/firebase/firestore';
import { StorageService } from '@/firebase/storage';

export interface FileAction {
  type: 'upload' | 'download' | 'delete' | 'rename' | 'move';
  fileId: string;
  spaceId: string;
  data?: any;
  timestamp: Date;
}

export class FileActions {
  /**
   * 上傳文件
   */
  static async uploadFile(
    file: File,
    spaceId: string,
    path: string = '/',
    metadata?: Record<string, any>
  ) {
    try {
      // 生成文件路徑
      const filePath = `spaces/${spaceId}/files/${Date.now()}-${file.name}`;
      
      // 上傳到 Storage
      const uploadResult = await StorageService.uploadFile(file, {
        path: filePath,
        metadata: {
          contentType: file.type,
          customMetadata: {
            originalName: file.name,
            spaceId,
            ...metadata,
          },
        },
      });

      // 創建文件記錄
      const fileId = crypto.randomUUID();
      const fileRecord = {
        id: fileId,
        name: file.name,
        originalName: file.name,
        path: filePath,
        url: uploadResult.url,
        size: file.size,
        mimeType: file.type,
        spaceId,
        ownerId: '', // 從 context 獲取
        isPublic: false,
        metadata: {
          ...metadata,
          uploadedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await FirestoreService.create('files', fileId, fileRecord);
      return fileRecord;
    } catch (error) {
      throw new Error(`上傳文件失敗: ${error}`);
    }
  }

  /**
   * 刪除文件
   */
  static async deleteFile(fileId: string, spaceId: string) {
    try {
      // 獲取文件信息
      const file = await FirestoreService.get('files', fileId);
      if (!file) {
        throw new Error('文件不存在');
      }

      // 從 Storage 刪除
      await StorageService.deleteFile(file.path);

      // 從 Firestore 刪除記錄
      await FirestoreService.delete('files', fileId);
    } catch (error) {
      throw new Error(`刪除文件失敗: ${error}`);
    }
  }

  /**
   * 重命名文件
   */
  static async renameFile(fileId: string, newName: string) {
    try {
      await FirestoreService.update('files', fileId, {
        name: newName,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`重命名文件失敗: ${error}`);
    }
  }

  /**
   * 移動文件
   */
  static async moveFile(fileId: string, newPath: string) {
    try {
      await FirestoreService.update('files', fileId, {
        path: newPath,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`移動文件失敗: ${error}`);
    }
  }

  /**
   * 獲取文件下載 URL
   */
  static async getFileDownloadUrl(filePath: string) {
    try {
      return await StorageService.getFileURL(filePath);
    } catch (error) {
      throw new Error(`獲取文件 URL 失敗: ${error}`);
    }
  }
}
