/**
 * @fileoverview A component that displays file type icons and generates thumbnails
 * for different file types. Supports images, PDFs, Office documents, and other file types.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  File, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Code,
  FileSpreadsheet,
  Presentation,
  FileImage,
  // TODO: [P2] REFACTOR src/components/ui/file-type-icon.tsx - 清理未使用的導入（useEffect, Image, Video, Music, Archive, Code 未使用）
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive
} from 'lucide-react';

export interface FileTypeIconProps {
  fileName: string;
  contentType?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showThumbnail?: boolean;
  thumbnailUrl?: string;
}

const FILE_TYPE_CONFIG = {
  // Images
  'image/jpeg': { icon: FileImage, color: 'text-green-600', bgColor: 'bg-green-50' },
  'image/jpg': { icon: FileImage, color: 'text-green-600', bgColor: 'bg-green-50' },
  'image/png': { icon: FileImage, color: 'text-green-600', bgColor: 'bg-green-50' },
  'image/gif': { icon: FileImage, color: 'text-green-600', bgColor: 'bg-green-50' },
  'image/webp': { icon: FileImage, color: 'text-green-600', bgColor: 'bg-green-50' },
  'image/svg+xml': { icon: FileImage, color: 'text-green-600', bgColor: 'bg-green-50' },
  
  // Videos
  'video/mp4': { icon: FileVideo, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  'video/avi': { icon: FileVideo, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  'video/mov': { icon: FileVideo, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  'video/wmv': { icon: FileVideo, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  'video/webm': { icon: FileVideo, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  
  // Audio
  'audio/mp3': { icon: FileAudio, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  'audio/wav': { icon: FileAudio, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  'audio/ogg': { icon: FileAudio, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  'audio/m4a': { icon: FileAudio, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  
  // Documents
  'application/pdf': { icon: FileText, color: 'text-red-600', bgColor: 'bg-red-50' },
  'application/msword': { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  'application/vnd.ms-excel': { icon: FileSpreadsheet, color: 'text-green-600', bgColor: 'bg-green-50' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileSpreadsheet, color: 'text-green-600', bgColor: 'bg-green-50' },
  'application/vnd.ms-powerpoint': { icon: Presentation, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: Presentation, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  
  // Archives
  'application/zip': { icon: FileArchive, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  'application/x-rar-compressed': { icon: FileArchive, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  'application/x-7z-compressed': { icon: FileArchive, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  'application/gzip': { icon: FileArchive, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  
  // Code
  'text/javascript': { icon: FileCode, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  'text/typescript': { icon: FileCode, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  'text/html': { icon: FileCode, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  'text/css': { icon: FileCode, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  'text/json': { icon: FileCode, color: 'text-gray-600', bgColor: 'bg-gray-50' },
  'text/xml': { icon: FileCode, color: 'text-gray-600', bgColor: 'bg-gray-50' },
  
  // CAD Files
  'application/dwg': { icon: File, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  'application/dxf': { icon: File, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
};

const SIZE_CONFIG = {
  sm: { icon: 'h-4 w-4', container: 'h-8 w-8' },
  md: { icon: 'h-6 w-6', container: 'h-12 w-12' },
  lg: { icon: 'h-8 w-8', container: 'h-16 w-16' },
};

export function FileTypeIcon({ 
  fileName, 
  contentType, 
  size = 'md', 
  className,
  showThumbnail = false,
  thumbnailUrl
}: FileTypeIconProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get file extension
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Determine file type configuration
  const getFileTypeConfig = () => {
    // First try by content type
    if (contentType && FILE_TYPE_CONFIG[contentType as keyof typeof FILE_TYPE_CONFIG]) {
      return FILE_TYPE_CONFIG[contentType as keyof typeof FILE_TYPE_CONFIG];
    }
    
    // Fallback to file extension
    const extensionMap: Record<string, keyof typeof FILE_TYPE_CONFIG> = {
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
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      'gz': 'application/gzip',
      'js': 'text/javascript',
      'ts': 'text/typescript',
      'html': 'text/html',
      'css': 'text/css',
      'json': 'text/json',
      'xml': 'text/xml',
      'dwg': 'application/dwg',
      'dxf': 'application/dxf',
    };
    
    const contentTypeKey = extensionMap[fileExtension];
    if (contentTypeKey && FILE_TYPE_CONFIG[contentTypeKey]) {
      return FILE_TYPE_CONFIG[contentTypeKey];
    }
    
    // Default fallback
    return { icon: File, color: 'text-gray-600', bgColor: 'bg-gray-50' };
  };

  const config = getFileTypeConfig();
  const IconComponent = config.icon;
  const sizeConfig = SIZE_CONFIG[size];

  // Handle thumbnail loading
  const handleThumbnailLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleThumbnailError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // Show thumbnail for images if available and not errored
  const shouldShowThumbnail = showThumbnail && 
    thumbnailUrl && 
    !imageError && 
    config.icon === FileImage;

  return (
    <div 
      className={cn(
        'relative flex items-center justify-center rounded-lg border-2 border-transparent transition-colors',
        sizeConfig.container,
        config.bgColor,
        className
      )}
    >
      {shouldShowThumbnail ? (
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
            </div>
          )}
          {/* TODO: [P2] FIX src/components/ui/file-type-icon.tsx - 修復 Next.js 圖片警告（改用 next/image） */}
          <img
            src={thumbnailUrl}
            alt={fileName}
            className="w-full h-full object-cover"
            onLoad={handleThumbnailLoad}
            onError={handleThumbnailError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        </div>
      ) : (
        <IconComponent 
          className={cn(
            sizeConfig.icon,
            config.color
          )}
        />
      )}
      
      {/* File extension badge for small size */}
      {size === 'sm' && (
        <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-xs px-1 py-0.5 rounded text-[10px] font-medium">
          {fileExtension.slice(0, 3).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default FileTypeIcon;