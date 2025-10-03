// TODO: [P0] FIX src/components/features/spaces/components/file-explorer/file-table.tsx - 修復語法錯誤（第52行未終止的字串）
// 說明：修正字串/JSX 轉義，確保語法正確並通過 Lint
/**
 * @fileoverview A component that renders a table of files and folders.
 * TODO: [P2] [BUG] [UI] [TODO] 修復字符串字面量錯誤 - 第51行包含未終止的字符串字面量
 * It supports sorting by various columns, selecting multiple items, and triggering
 * actions on individual items. It also includes a settings menu to toggle
 * the visibility of columns.
 */
'use client';
// TODO[P2][lint][parser-error]: 第54行未終止字串，請關閉引號或修正 JSX 轉義。
// - 建議：
//   1) 檢查 `columns` 陣列中 label 的字串是否有未關閉引號。
//   2) 檢查中文標點或全形符號是否破壞了 JSX/TSX。
//   3) 僅修字串與標籤，不改動邏輯。

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ChevronUp, 
  ChevronDown, 
  MoreVertical,
  ArrowUpDown,
  File,
  Folder,
  FolderOpen
} from 'lucide-react';

// TODO: [P2] REFACTOR src/components/features/spaces/components/file-explorer/file-table.tsx:29 - 清理未使用的導入
// 問題：'FolderOpen' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team
import { cn } from '@/lib/utils';
import { type FileItem } from './folder-tree';
import { ColumnSettingsMenu, type ColumnConfig } from './column-settings-menu';

interface FileTableProps {
  files: FileItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onItemClick: (item: FileItem) => void;
  onItemAction: (item: FileItem, action: string) => void;
}

type SortField = 'name' | 'description' | 'version' | 'indicator' | 'tag' | 'issue' | 'size' | 'lastUpdate' | 'updater' | 'versionContributor' | 'reviewStatus';
type SortDirection = 'asc' | 'desc';

export function FileTable({ files, selectedItems, onSelectionChange, onItemClick, onItemAction }: FileTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // ?�設定�???
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'description', label: '?�述', visible: true },
    { id: 'version', label: '?�本', visible: true },
    { id: 'indicator', label: '?��?', visible: true },
    { id: 'tag', label: '標�?', visible: true },
    { id: 'issue', label: '?��?', visible: true },
    { id: 'size', label: '大�?', visible: true },
    { id: 'lastUpdate', label: '上次?�新', visible: true },
    // TODO[P2][lint][parser-error][低認知]: 關閉字串引號
    { id: 'updater', label: '?�新??', visible: true },
    { id: 'versionContributor', label: '?�本?�入??', visible: true },
    { id: 'reviewStatus', label: '審閱?�??', visible: true },
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
// TODO: [P2] REFACTOR src/components/features/spaces/components/file-explorer/file-table.tsx:76-77 - 修復 TypeScript any 類型使用
// 問題：使用 any 類型違反類型安全原則
// 影響：失去類型檢查，可能導致運行時錯誤
// 建議：定義具體的類型接口替代 any 類型
// @assignee frontend-team
// @deadline 2025-01-25

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'description':
          aValue = a.description || '';
          bValue = b.description || '';
          break;
        case 'version':
          aValue = a.version || '';
          bValue = b.version || '';
          break;
        case 'indicator':
          aValue = a.indicator || '';
          bValue = b.indicator || '';
          break;
        case 'tag':
          aValue = a.tag || '';
          bValue = b.tag || '';
          break;
        case 'issue':
          aValue = a.issue || '';
          bValue = b.issue || '';
          break;
        case 'size':
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case 'lastUpdate':
          aValue = new Date(a.updated).getTime();
          bValue = new Date(b.updated).getTime();
          break;
        case 'updater':
          aValue = a.updater || '';
          bValue = b.updater || '';
          break;
        case 'versionContributor':
          aValue = a.versionContributor || '';
          bValue = b.versionContributor || '';
          break;
        case 'reviewStatus':
          aValue = a.reviewStatus || '';
          bValue = b.reviewStatus || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [files, sortField, sortDirection]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(files.map(file => file.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedItems, itemId]);
    } else {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '--';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const getInitials = (name?: string) => {
    if (!name) return '--';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleColumnToggle = (columnId: string, visible: boolean) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, visible } : col
    ));
  };

  const handleReset = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const handlePropertySettings = () => {
    console.log('Property settings clicked');
  };

  const getVisibleColumns = () => columns.filter(col => col.visible);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedItems.length === files.length && files.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-2">
                ?�稱
                {getSortIcon('name')}
              </div>
            </TableHead>
            {getVisibleColumns().map((column) => (
              <TableHead 
                key={column.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort(column.id as SortField)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {getSortIcon(column.id as SortField)}
                </div>
              </TableHead>
            ))}
            <TableHead className="w-12">
              <ColumnSettingsMenu
                columns={columns}
                onColumnToggle={handleColumnToggle}
                onReset={handleReset}
                onPropertySettings={handlePropertySettings}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFiles.map((file) => {
            const isSelected = selectedItems.includes(file.id);
            return (
              <TableRow 
                key={file.id}
                className={cn(
                  "cursor-pointer hover:bg-muted/50",
                  isSelected && "bg-blue-50"
                )}
                onClick={() => onItemClick(file)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectItem(file.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {file.type === 'folder' ? (
                      <Folder className="h-4 w-4 text-blue-500" />
                    ) : (
                      <File className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{file.name}</span>
                  </div>
                </TableCell>
                {getVisibleColumns().map((column) => (
                  <TableCell key={column.id}>
                    {column.id === 'description' && (file.description || '--')}
                    {column.id === 'version' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {file.version || 'V1'}
                      </span>
                    )}
                    {column.id === 'indicator' && (file.indicator || '--')}
                    {column.id === 'tag' && (file.tag || '--')}
                    {column.id === 'issue' && (file.issue || '--')}
                    {column.id === 'size' && formatFileSize(file.size)}
                    {column.id === 'lastUpdate' && formatDate(file.updated)}
                    {column.id === 'updater' && (
                      file.updater ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(file.updater)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{file.updater}</span>
                        </div>
                      ) : (
                        '--'
                      )
                    )}
                    {column.id === 'versionContributor' && (file.versionContributor || '--')}
                    {column.id === 'reviewStatus' && (file.reviewStatus || '--')}
                  </TableCell>
                ))}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onItemAction(file, 'menu')}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
