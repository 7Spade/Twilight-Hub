/**
 * @fileoverview A slide-out drawer component to display the version history of a file.
 * It lists all previous versions of a selected file, showing metadata for each version
 * such as version number, update time, and who updated it.
 */
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// TODO: [P2] REFACTOR src/components/features/spaces/components/file-explorer/version-history-drawer.tsx:12 - 清理未使用的導入
// 問題：'Avatar', 'AvatarFallback' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team

import { Badge } from '@/components/ui/badge';
import { 
  X, 
  FileText, 
  MoreVertical,
  Calendar,
  User
} from 'lucide-react';

// TODO: [P2] REFACTOR src/components/features/spaces/components/file-explorer/version-history-drawer.tsx:19 - 清理未使用的導入
// 問題：'User' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team

import { cn } from '@/lib/utils';

// TODO: [P2] REFACTOR src/components/features/spaces/components/file-explorer/version-history-drawer.tsx:21 - 清理未使用的導入
// 問題：'cn' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team

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
  const _getInitials = (name: string) => {
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
          {/* TODO[P2][lint][parser-error][低認知]: 修正未終止標籤，應為 </SheetTitle> */}
          <SheetTitle className="text-lg font-semibold">?�本歷史紀??</SheetTitle>
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
          {/* ?��??�件信息 */}
          {currentFile && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-medium">{currentFile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ?��??�本: {currentFile.version}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ?�本?�表 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              ?�本歷史
            </h4>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>?�本</TableHead>
                    <TableHead>?�稱</TableHead>
                    <TableHead>?��?</TableHead>
                    <TableHead>標�?</TableHead>
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
                            <span>已由??{formatDate(version.updatedAt)}</span>
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

          {/* 底部?�??*/}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              �?��展示 {versions.length} ?��???
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
