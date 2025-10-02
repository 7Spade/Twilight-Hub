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
import { ContextMenu } from './context-menu';

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
  onItemAction?: (item: FileItem, action: string) => void;
}

export function FolderTree({ files, selectedItems, onSelectionChange, onItemClick, onItemAction }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['project-files', 'supported']));

  // 模擬資料夾數據，符合圖片中的設計
  const mockFolders: FileItem[] = [
    { id: 'bids', name: 'Bids', type: 'folder', timeCreated: '', updated: '', children: [] },
    { id: 'contractors', name: 'Contractors', type: 'folder', timeCreated: '', updated: '', children: [] },
    { id: 'coordination', name: 'Coordinati...', type: 'folder', timeCreated: '', updated: '', children: [] },
    { id: 'correspondence', name: 'Correspond...', type: 'folder', timeCreated: '', updated: '', children: [] },
    { id: 'crystal-clear', name: 'Crystal-Cle...', type: 'folder', timeCreated: '', updated: '', children: [] },
    { id: 'delta-engineering', name: 'Delta-Engi...', type: 'folder', timeCreated: '', updated: '', children: [] },
    { id: 'drawings', name: 'Drawings', type: 'folder', timeCreated: '', updated: '', children: [] },
    { id: 'for-the-field', name: 'For the Field', type: 'folder', timeCreated: '', updated: '', children: [] },
    { id: 'handover', name: 'Handover ...', type: 'folder', timeCreated: '', updated: '', children: [] },
    { id: 'quantify', name: 'Quantify m...', type: 'folder', timeCreated: '', updated: '', children: [] },
    { 
      id: 'supported', 
      name: 'Supported ...', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: 'pdfs', name: 'PDFs', type: 'folder', timeCreated: '', updated: '', children: [] }
      ]
    }
  ];

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
            "flex items-center gap-2 py-2 px-3 hover:bg-muted/30 cursor-pointer group",
            isSelected && "bg-blue-50"
          )}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
        >
          {/* 展開/收合箭頭 */}
          <div className="w-4 h-4 flex items-center justify-center">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => toggleFolder(item.id)}
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            ) : (
              <div className="h-3 w-3" />
            )}
          </div>
          
          {/* 資料夾圖標 */}
          <div className="w-4 h-4 flex items-center justify-center">
            {item.type === 'folder' && (
              <Folder className="h-4 w-4 text-gray-500" />
            )}
          </div>
          
          {/* 資料夾名稱 */}
          <span 
            className="text-sm text-gray-700 truncate flex-1"
            onClick={() => onItemClick(item)}
          >
            {item.name}
          </span>
          
          {/* 更多選項按鈕 */}
          <ContextMenu
            item={item}
            onAction={(action) => onItemAction?.(item, action)}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3 w-3 text-gray-400" />
            </Button>
          </ContextMenu>
        </div>
        
        {/* 子資料夾 */}
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
            <div className="flex items-center gap-2 py-2 px-3 hover:bg-muted/30 cursor-pointer group">
              <div className="w-4 h-4 flex items-center justify-center">
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
              </div>
              <div className="w-4 h-4 flex items-center justify-center">
                <Folder className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">專案檔案</span>
              <ContextMenu
                item={{ id: 'project-files', name: '專案檔案', type: 'folder', timeCreated: '', updated: '' }}
                onAction={(action) => onItemAction?.({ id: 'project-files', name: '專案檔案', type: 'folder', timeCreated: '', updated: '' }, action)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent ml-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3 w-3 text-gray-400" />
                </Button>
              </ContextMenu>
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {mockFolders.map(item => renderFolderItem(item))}
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
