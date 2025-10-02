'use client';

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
import { cn } from '@/lib/utils';
import { type FileItem } from './folder-tree';

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
                名稱
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('description')}
            >
              <div className="flex items-center gap-2">
                描述
                {getSortIcon('description')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('version')}
            >
              <div className="flex items-center gap-2">
                版本
                {getSortIcon('version')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('indicator')}
            >
              <div className="flex items-center gap-2">
                指標
                {getSortIcon('indicator')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('tag')}
            >
              <div className="flex items-center gap-2">
                標記
                {getSortIcon('tag')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('issue')}
            >
              <div className="flex items-center gap-2">
                問題
                {getSortIcon('issue')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('size')}
            >
              <div className="flex items-center gap-2">
                大小
                {getSortIcon('size')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('lastUpdate')}
            >
              <div className="flex items-center gap-2">
                上次更新
                {getSortIcon('lastUpdate')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('updater')}
            >
              <div className="flex items-center gap-2">
                更新者
                {getSortIcon('updater')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('versionContributor')}
            >
              <div className="flex items-center gap-2">
                版本加入者
                {getSortIcon('versionContributor')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('reviewStatus')}
            >
              <div className="flex items-center gap-2">
                審閱狀態
                {getSortIcon('reviewStatus')}
              </div>
            </TableHead>
            <TableHead className="w-12">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
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
                <TableCell>{file.description || '--'}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {file.version || 'V1'}
                  </span>
                </TableCell>
                <TableCell>{file.indicator || '--'}</TableCell>
                <TableCell>{file.tag || '--'}</TableCell>
                <TableCell>{file.issue || '--'}</TableCell>
                <TableCell>{formatFileSize(file.size)}</TableCell>
                <TableCell>{formatDate(file.updated)}</TableCell>
                <TableCell>
                  {file.updater ? (
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
                  )}
                </TableCell>
                <TableCell>{file.versionContributor || '--'}</TableCell>
                <TableCell>{file.reviewStatus || '--'}</TableCell>
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
