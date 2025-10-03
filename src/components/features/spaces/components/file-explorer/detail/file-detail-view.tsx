/**
 * @fileoverview A component that displays detailed file information and preview
 * in a side panel. Integrates with Context7 file viewing libraries.
 */
'use client';
// TODO: [P2] FIX src/components/features/spaces/components/file-explorer/detail/file-detail-view.tsx - 修復字符串字面量錯誤（第75行未終止）

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Download, 
  Share, 
  Edit, 
  Trash2, 
  Star, 
  MoreVertical,
  FileText,
  Calendar,
  User,
  HardDrive,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { type FileItem } from '../folder-tree';
import { FilePreviewServiceFactory, type PreviewDocument, type PreviewConfig } from '../services/file-preview-service';

export interface FileDetailViewProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (file: FileItem) => void;
  onShare?: (file: FileItem) => void;
  onEdit?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
  onStar?: (file: FileItem) => void;
  className?: string;
}

export function FileDetailView({
  file,
  isOpen,
  onClose,
  onDownload,
  onShare,
  onEdit,
  onDelete,
  onStar,
  className
}: FileDetailViewProps) {
  const [previewDocument, setPreviewDocument] = useState<PreviewDocument | null>(null);
  const [previewConfig, setPreviewConfig] = useState<PreviewConfig>({});
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize preview when file changes
  useEffect(() => {
    if (file && isOpen) {
      setIsLoading(true);
      setPreviewError(null);
      
      try {
        const service = FilePreviewServiceFactory.getBestServiceForFile(file);
        if (service) {
          const document = service.toPreviewDocument(file);
          const config = service.getPreviewConfig(file);
          setPreviewDocument(document);
          setPreviewConfig(config);
        } else {
          setPreviewError('不支?�此檔�?類�??��?�?);
        }
      } catch (error) {
        setPreviewError('載入?�覽?�發?�錯�?);
        console.error('Preview error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [file, isOpen]);

  if (!isOpen || !file) {
    return null;
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '--';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = () => {
    switch (file.reviewStatus) {
      case '已審??:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '待審??:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (file.reviewStatus) {
      case '已審??:
        return <Badge variant="secondary" className="bg-green-100 text-green-800">已審??/Badge>;
      case '待審??:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">待審??/Badge>;
      default:
        return <Badge variant="outline">?�審??/Badge>;
    }
  };

  const getTagBadge = () => {
    if (!file.tag || file.tag === '--') return null;
    
    const tagColors: Record<string, string> = {
      '?��?': 'bg-red-100 text-red-800',
      '?�稿': 'bg-yellow-100 text-yellow-800',
      '?��?': 'bg-blue-100 text-blue-800',
      '?��?': 'bg-purple-100 text-purple-800',
    };
    
    return (
      <Badge variant="secondary" className={tagColors[file.tag] || 'bg-gray-100 text-gray-800'}>
        {file.tag}
      </Badge>
    );
  };

  return (
    <div className={cn('fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l z-50', className)}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold truncate" title={file.name}>
            {file.name}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* File Preview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                檔�??�覽
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
                </div>
              ) : previewError ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">{previewError}</p>
                  </div>
                </div>
              ) : previewDocument ? (
                <div className="border rounded-lg p-2 bg-gray-50">
                  <div className="text-sm text-gray-600 mb-2">
                    ?�覽: {previewDocument.fileName}
                  </div>
                  <div className="text-xs text-gray-500">
                    類�?: {previewDocument.fileType}
                  </div>
                  {/* In a real implementation, this would render the actual preview */}
                  <div className="mt-2 p-4 bg-white rounded border text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <p>檔�??�覽將在此�?顯示</p>
                    <p className="text-xs mt-1">?��? Context7 庫�??�用</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">?��??�覽此�?�?/p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">檔�?資�?</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="text-sm text-gray-600">?�??/span>
                </div>
                {getStatusBadge()}
              </div>

              <Separator />

              {/* Tag */}
              {getTagBadge() && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">標�?</span>
                    </div>
                    {getTagBadge()}
                  </div>
                  <Separator />
                </>
              )}

              {/* Size */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">大�?</span>
                </div>
                <span className="text-sm font-medium">{formatFileSize(file.size)}</span>
              </div>

              <Separator />

              {/* Version */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">?�本</span>
                <span className="text-sm font-medium">{file.version || 'V1'}</span>
              </div>

              <Separator />

              {/* Created Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">建�??��?</span>
                </div>
                <span className="text-sm font-medium">{formatDate(file.timeCreated)}</span>
              </div>

              <Separator />

              {/* Updated Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">修改?��?</span>
                </div>
                <span className="text-sm font-medium">{formatDate(file.updated)}</span>
              </div>

              <Separator />

              {/* Updater */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">?�新??/span>
                </div>
                <span className="text-sm font-medium">{file.updater || '--'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {file.description && file.description !== '--' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">?�述</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700">{file.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="border-t p-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDownload?.(file)}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              下�?
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onShare?.(file)}
              className="flex-1"
            >
              <Share className="h-4 w-4 mr-2" />
              ?�享
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit?.(file)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onStar?.(file)}
            >
              <Star className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete?.(file)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileDetailView;
