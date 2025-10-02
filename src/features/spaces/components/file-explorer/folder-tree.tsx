'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  contentType?: string;
  timeCreated: string;
  updated: string;
  description?: string;
  version?: string;
  indicator?: string;
  tag?: string;
  issue?: string;
  updater?: string;
  versionContributor?: string;
  reviewStatus?: string;
  children?: FileItem[];
}

interface FolderTreeProps {
  files: FileItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onItemClick: (item: FileItem) => void;
}

export function FolderTree({ files, selectedItems, onSelectionChange, onItemClick }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['project-files']));

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderItem = (item: FileItem, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <div
          className={cn(
            "flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 cursor-pointer group",
            isSelected && "bg-blue-50"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {item.type === 'folder' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => toggleFolder(item.id)}
            >
              {hasChildren ? (
                isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
              ) : (
                <div className="h-3 w-3" />
              )}
            </Button>
          )}
          
          {item.type === 'folder' && (
            isExpanded ? <FolderOpen className="h-4 w-4 text-blue-500" /> : <Folder className="h-4 w-4 text-blue-500" />
          )}
          
          <span 
            className="text-sm truncate flex-1"
            onClick={() => onItemClick(item)}
          >
            {item.name}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              // 這裡可以觸發上下文菜單
            }}
          >
            <MoreVertical className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
        
        {item.type === 'folder' && isExpanded && hasChildren && (
          <div>
            {item.children!.map(child => renderFolderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="folders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="folders">資料夾</TabsTrigger>
          <TabsTrigger value="packages">套件</TabsTrigger>
        </TabsList>
        
        <TabsContent value="folders" className="mt-2">
          <div className="space-y-1">
            {/* 根目錄 - 專案檔案 */}
            <div className="flex items-center gap-2 py-1 px-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => toggleFolder('project-files')}
              >
                {expandedFolders.has('project-files') ? 
                  <ChevronDown className="h-3 w-3" /> : 
                  <ChevronRight className="h-3 w-3" />
                }
              </Button>
              <Folder className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">專案檔案</span>
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {files.map(item => renderFolderItem(item))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        
        <TabsContent value="packages" className="mt-2">
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">套件功能開發中...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
