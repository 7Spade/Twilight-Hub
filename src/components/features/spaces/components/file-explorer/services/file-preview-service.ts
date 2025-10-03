// TODO: [P0] FIX src/components/features/spaces/components/file-explorer/services/file-preview-service.ts - 修復語法錯誤（第224行未終止的字串）
// 說明：補齊引號或移除多餘字元，確保語法正確
/**
 * @fileoverview Abstract service layer for file preview functionality.
 * Provides a unified interface for different file preview libraries.
 */
'use client';

import { type FileItem } from '../folder-tree';

export interface PreviewDocument {
  uri: string;
  fileName: string;
  fileType?: string;
}

export interface PreviewConfig {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  showHeader?: boolean;
  showToolbar?: boolean;
}

export interface PreviewError {
  code: string;
  message: string;
  details?: any;
}

export interface FilePreviewService {
  /**
   * Check if the service can preview the given file type
   */
  canPreview(file: FileItem): boolean;

  /**
   * Get preview configuration for the file
   */
  getPreviewConfig(file: FileItem): PreviewConfig;

  /**
   * Convert file to preview document format
   */
  toPreviewDocument(file: FileItem): PreviewDocument;

  /**
   * Handle preview errors
   */
  handleError(error: any): PreviewError;

  /**
   * Get supported file types
   */
  getSupportedTypes(): string[];
}

/**
 * Base implementation of FilePreviewService
 */
export abstract class BaseFilePreviewService implements FilePreviewService {
  protected supportedTypes: string[] = [];

  abstract canPreview(file: FileItem): boolean;
  abstract getPreviewConfig(file: FileItem): PreviewConfig;
  abstract toPreviewDocument(file: FileItem): PreviewDocument;
  abstract handleError(error: any): PreviewError;

  getSupportedTypes(): string[] {
    return this.supportedTypes;
  }

  protected getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  protected getMimeType(fileName: string, contentType?: string): string {
    if (contentType) return contentType;
    
    const extension = this.getFileExtension(fileName);
    const mimeMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'mp4': 'video/mp4',
      'avi': 'video/avi',
      'mov': 'video/mov',
      'wmv': 'video/wmv',
      'webm': 'video/webm',
      'mp3': 'audio/mp3',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'm4a': 'audio/m4a',
      'txt': 'text/plain',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
      'ts': 'text/typescript',
      'json': 'application/json',
      'xml': 'text/xml',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      'gz': 'application/gzip',
      'dwg': 'application/dwg',
      'dxf': 'application/dxf',
    };
    
    return mimeMap[extension] || 'application/octet-stream';
  }
}

/**
 * React Doc Viewer implementation
 */
export class ReactDocViewerService extends BaseFilePreviewService {
  constructor() {
    super();
    this.supportedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/webm',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/m4a',
      'text/plain',
      'text/html',
      'text/css',
      'text/javascript',
      'text/typescript',
      'application/json',
      'text/xml',
    ];
  }

  canPreview(file: FileItem): boolean {
    const mimeType = this.getMimeType(file.name, file.contentType);
    return this.supportedTypes.includes(mimeType);
  }

  getPreviewConfig(file: FileItem): PreviewConfig {
    const mimeType = this.getMimeType(file.name, file.contentType);
    
    // Default configuration
    const config: PreviewConfig = {
      width: 800,
      height: 600,
      theme: 'light',
      showHeader: true,
      showToolbar: true,
    };

    // Adjust configuration based on file type
    if (mimeType.startsWith('image/')) {
      config.width = 600;
      config.height = 400;
    } else if (mimeType.startsWith('video/')) {
      config.width = 800;
      config.height = 450;
    } else if (mimeType.startsWith('audio/')) {
      config.width = 600;
      config.height = 200;
    }

    return config;
  }

  toPreviewDocument(file: FileItem): PreviewDocument {
    // In a real implementation, this would generate a URL to the file
    // For now, we'll use a placeholder URL
    const fileUrl = `/api/files/${file.id}`;
    
    return {
      uri: fileUrl,
      fileName: file.name,
      fileType: this.getMimeType(file.name, file.contentType),
    };
  }

  handleError(error: any): PreviewError {
    if (error.code) {
      return {
        code: error.code,
        message: error.message || 'Unknown preview error',
        details: error,
      };
    }

    // Handle common error types
    if (error.message?.includes('404')) {
      return {
        code: 'FILE_NOT_FOUND',
        message: '檔案不存在',
        details: error,
      };
    }

    if (error.message?.includes('403')) {
      return {
        code: 'ACCESS_DENIED',
        // TODO[P2][lint][parser-error][低認知]: 關閉字串引號以通過 TS 解析
        message: '沒有權限存取此檔案',
        details: error,
      };
    }

    if (error.message?.includes('network')) {
      return {
        code: 'NETWORK_ERROR',
        message: '網路錯誤，請檢查網路連線',
        details: error,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      // TODO[P2][lint][parser-error][低認知]: 關閉字串引號
      message: '預覽檔案發生未預期錯誤',
      details: error,
    };
  }
}

/**
 * Service factory for creating preview services
 */
export class FilePreviewServiceFactory {
  private static services: Map<string, FilePreviewService> = new Map();

  static registerService(name: string, service: FilePreviewService): void {
    this.services.set(name, service);
  }

  static getService(name: string): FilePreviewService | undefined {
    return this.services.get(name);
  }

  static getDefaultService(): FilePreviewService {
    // Return React Doc Viewer as default
    const defaultService = this.services.get('react-doc-viewer');
    if (defaultService) {
      return defaultService;
    }

    // Create and register default service
    const service = new ReactDocViewerService();
    this.registerService('react-doc-viewer', service);
    return service;
  }

  static getBestServiceForFile(file: FileItem): FilePreviewService | null {
    for (const service of this.services.values()) {
      if (service.canPreview(file)) {
        return service;
      }
    }
    return null;
  }
}

// Initialize default services
FilePreviewServiceFactory.registerService('react-doc-viewer', new ReactDocViewerService());

export default FilePreviewServiceFactory;
