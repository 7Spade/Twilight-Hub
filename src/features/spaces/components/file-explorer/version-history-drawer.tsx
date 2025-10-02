'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  FileText, 
  MoreVertical,
  Calendar,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VersionItem {
  id: string;
  version: string;
  name: string;
  indicator?: string;
  tag?: string;
  updatedAt: string;
  updatedBy: string;
  description?: string;
}

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  versions: VersionItem[];
  currentFile?: {
    name: string;
    version: string;
  };
}

export function VersionHistoryDrawer({ 
  isOpen, 
  onClose, 
  versions, 
  currentFile 
}: VersionHistoryDrawerProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="text-lg font-semibold">版本歷史紀錄</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* 當前文件信息 */}
          {currentFile && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-medium">{currentFile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    目前版本: {currentFile.version}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 版本列表 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              版本歷史
            </h4>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>名稱</TableHead>
                    <TableHead>指標</TableHead>
                    <TableHead>標記</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version) => (
                    <TableRow key={version.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {version.version}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{version.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>已由於 {formatDate(version.updatedAt)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {version.indicator || '--'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {version.tag || '--'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 底部狀態 */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              正在展示 {versions.length} 個版本
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
