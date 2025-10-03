/**
 * @fileoverview A modal component to display, restore, or permanently delete items.
 * It shows a list of items that have been moved to the trash, along with metadata
 * like deletion date and original location. This component is triggered from the main
 * file explorer toolbar.
 */
'use client';
// TODO: [P2] FIX src/components/features/spaces/components/file-explorer/deleted-items.tsx - 修復字符串字面量錯誤（第50行未終止）

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, RotateCcw, Trash, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type FileItem } from './folder-tree';

interface DeletedItem extends FileItem {
  deletedAt: string;
  deletedBy: string;
  originalPath: string;
}

interface DeletedItemsProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (item: DeletedItem) => void;
  onPermanentDelete: (item: DeletedItem) => void;
}

export function DeletedItems({ 
  isOpen, 
  onClose, 
  onRestore, 
  onPermanentDelete 
}: DeletedItemsProps) {
  // 模擬已刪除項目
  const [deletedItems] = useState<DeletedItem[]>([
    {
      id: 'deleted-1',
      name: 'old-drawing.pdf',
      type: 'file',
      size: 1024000,
      contentType: 'application/pdf',
      timeCreated: '2024-01-01T00:00:00Z',
      updated: '2024-01-15T10:30:00Z',
      description: '新建版本',
      version: 'V1',
      indicator: '--',
      tag: '已審核',
      issue: '--',
      updater: 'ACC Sample P...',
      versionContributor: '--',
      reviewStatus: '--',
      deletedAt: '2024-01-20T14:30:00Z',
      deletedBy: 'ACC Sample P...',
      originalPath: '/專案檔案/Drawings/'
    },
    {
      id: 'deleted-2',
      name: 'temp-contract.docx',
      type: 'file',
      size: 256000,
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      timeCreated: '2024-01-10T00:00:00Z',
      updated: '2024-01-18T09:15:00Z',
      description: '臨時文件',
      version: 'V2',
      indicator: '--',
      tag: '草稿',
      issue: '--',
      updater: 'ACC 系統',
      versionContributor: '--',
      reviewStatus: '--',
      deletedAt: '2024-01-19T16:45:00Z',
      deletedBy: 'ACC 系統',
      originalPath: '/專案檔案/Correspondence/'
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '--';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            已刪除項目
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            關閉
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[60vh]">
          {deletedItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trash2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">沒有已刪除的項目</p>
              <p className="text-sm">已刪除的檔案與資料夾將在此顯示</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                顯示 {deletedItems.length} 個已刪除項目
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>名稱</TableHead>
                    <TableHead>原始位置</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead>刪除時間</TableHead>
                    <TableHead>刪除者</TableHead>
                    <TableHead className="w-32">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <input type="checkbox" className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-4 w-4 rounded",
                            item.type === 'folder' ? 'bg-blue-100' : 'bg-gray-100'
                          )} />
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.type === 'folder' ? '資料夾' : '檔案'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {item.originalPath}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatFileSize(item.size)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(item.deletedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {item.deletedBy}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRestore(item)}
                            className="h-8 px-2"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            還原
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPermanentDelete(item)}
                            className="h-8 px-2 text-red-600 hover:text-red-700"
                          >
                            <Trash className="h-3 w-3 mr-1" />
                            永久刪除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
