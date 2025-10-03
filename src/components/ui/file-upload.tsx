/**
 * 文件上傳組件
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 提供文件上傳、預覽、管理功能
 * 位置: src/components/ui/file-upload.tsx
 */

'use client';
/* TODO: [P1] [BUG] [UI] [TODO] 修復 React Hooks 規則違反 - 第65、72、252行在回調函數中調用 Hook，必須在組件頂層調用 */

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileTypeIcon } from '@/components/ui/file-type-icon';
import { 
  Upload, 
  File, 
  X, 
  Download, 
  Eye, 
  Trash2,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { useUploadFile, useDeleteFile, useDownloadFile, usePreviewFile, useFormatFileSize, useIsFileTypeSupported } from '@/hooks/use-file-operations';
import { ContractDocument } from '@/lib/types/contract.types';

interface FileUploadProps {
  path: string;
  userId: string;
  userName: string;
  userEmail: string;
  documents?: ContractDocument[];
  onDocumentsChange?: (documents: ContractDocument[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  className?: string;
}

export function FileUpload({
  path,
  userId,
  userName,
  userEmail,
  documents = [],
  onDocumentsChange,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'],
  className,
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragActive, setDragActive] = useState(false);

  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const downloadFile = useDownloadFile();
  const previewFile = usePreviewFile();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      // TODO: [P1] [BUG] [UI] [TODO] 修復 React Hooks 規則違反 - useIsFileTypeSupported 不能在回調中調用
      // 檢查文件類型
      if (!useIsFileTypeSupported(file.name)) {
        alert(`不支持的文件類型: ${file.name}`);
        return;
      }

      // TODO: [P1] [BUG] [UI] [TODO] 修復 React Hooks 規則違反 - useFormatFileSize 不能在回調中調用
      // 檢查文件大小
      if (file.size > maxSize) {
        alert(`文件太大: ${file.name} (最大 ${useFormatFileSize(maxSize)})`);
        return;
      }

      // 檢查文件數量
      if (documents.length >= maxFiles) {
        alert(`最多只能上傳 ${maxFiles} 個文件`);
        return;
      }

      // 開始上傳
      uploadFile.mutate(
        { 
          file, 
          path, 
          userId, 
          userName, 
          userEmail 
        },
        {
          onSuccess: (document) => {
            onDocumentsChange?.([...documents, document]);
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[file.name];
              return newProgress;
            });
          },
          onError: (error) => {
            console.error('Upload error:', error);
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[file.name];
              return newProgress;
            });
          },
        }
      );

      // 模擬上傳進度
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0,
      }));

      // 模擬進度更新
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[file.name] || 0;
          if (current >= 100) {
            clearInterval(interval);
            return prev;
          }
          return {
            ...prev,
            [file.name]: Math.min(current + 10, 100),
          };
        });
      }, 100);
    });
  }, [path, userId, userName, userEmail, documents, maxFiles, maxSize, uploadFile, onDocumentsChange]);

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = acceptedTypes.join(',');
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      onDrop(files);
    };
    input.click();
  };

  const handleDeleteFile = (document: ContractDocument) => {
    if (confirm(`確定要刪除文件 "${document.name}" 嗎？`)) {
      deleteFile.mutate(
        { document, path },
        {
          onSuccess: () => {
            onDocumentsChange?.(documents.filter(doc => doc.id !== document.id));
          },
        }
      );
    }
  };

  const handleDownloadFile = (document: ContractDocument) => {
    downloadFile.mutate({ document });
  };

  const handlePreviewFile = (document: ContractDocument) => {
    previewFile.mutate({ document });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 上傳區域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            文件上傳
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
              }
              ${uploadFile.isPending ? 'pointer-events-none opacity-50' : ''}
            `}
            onClick={handleFileSelect}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const files = Array.from(e.dataTransfer.files);
              onDrop(files);
            }}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {dragActive ? '放開文件以上傳' : '拖拽文件到這裡或點擊選擇'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              支持 {acceptedTypes.join(', ')} 格式，最大 {useFormatFileSize(maxSize)}
            </p>
            <p className="text-xs text-muted-foreground">
              最多 {maxFiles} 個文件
            </p>
          </div>

          {/* 上傳進度 */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{fileName}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 文件列表 */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              已上傳文件 ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileTypeIcon 
                      fileName={document.name}
                      contentType={document.type}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{document.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{useFormatFileSize(document.size)}</span>
                        <span>•</span>
                        <span>{document.uploadedAt.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{document.uploadedBy.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreviewFile(document)}
                      title="預覽"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadFile(document)}
                      title="下載"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(document)}
                      title="刪除"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

