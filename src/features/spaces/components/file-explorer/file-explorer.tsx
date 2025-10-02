'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFileActions } from '@/features/spaces/hooks';
import { FolderTree, type FileItem } from './folder-tree';
import { FileTable } from './file-table';
import { ContextMenu, ToolbarContextMenu } from './context-menu';
import { Toolbar } from './toolbar';
import { UploadDialog } from './upload-dialog';
import { VersionHistoryDrawer, type VersionItem } from './version-history-drawer';
import { EmptyFolderState } from './empty-folder-state';
import { FilterPanel, type FilterOptions } from './filter-panel';
import { BreadcrumbNavigation, type BreadcrumbItem } from './breadcrumb-navigation';
import { DeletedItems } from './deleted-items';

interface FileExplorerProps {
  spaceId: string;
  userId: string;
}

export function FileExplorer({ spaceId, userId }: FileExplorerProps) {
  const { 
    uploadFile, 
    downloadFile, 
    deleteFile, 
    listFiles, 
    isLoading, 
    uploadProgress,
    files: rawFiles 
  } = useFileActions();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenuItem, setContextMenuItem] = useState<FileItem | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);
  const [selectedFileForVersion, setSelectedFileForVersion] = useState<FileItem | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    searchQuery: '',
    searchScope: 'current',
    includeSubfolders: true,
    includeContent: true,
  });
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([
    { id: 'project-files', name: '專案檔案' }
  ]);
  const [isDeletedItemsOpen, setIsDeletedItemsOpen] = useState(false);

  // 轉換原始文件數據為 FileItem 格式，並添加一些測試檔案
  const files: FileItem[] = useMemo(() => {
    const realFiles = rawFiles.map(file => ({
      id: file.name,
      name: file.name,
      type: 'file' as const,
      size: file.size,
      contentType: file.contentType,
      timeCreated: file.timeCreated,
      updated: file.updated,
      description: '--',
      version: 'V1',
      indicator: '--',
      tag: '--',
      issue: '--',
      updater: 'ACC Sample P...',
      versionContributor: '--',
      reviewStatus: '--',
    }));

    // 添加一些測試檔案以便展示收合功能
    const testFiles: FileItem[] = [
      {
        id: 'test-arch-001',
        name: 'A000 - ARCHITECTURAL DRAWING.pdf',
        type: 'file',
        size: 1024000,
        contentType: 'application/pdf',
        timeCreated: '2024-01-01T00:00:00Z',
        updated: '2024-01-15T10:30:00Z',
        description: '建築平面圖',
        version: 'V2',
        indicator: '--',
        tag: '重要',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: '已審閱',
      },
      {
        id: 'test-office-001',
        name: 'A100 - OFFICE - FLOOR PLAN.dwg',
        type: 'file',
        size: 512000,
        contentType: 'application/dwg',
        timeCreated: '2024-01-02T00:00:00Z',
        updated: '2024-01-16T14:20:00Z',
        description: '辦公室平面圖',
        version: 'V1',
        indicator: '--',
        tag: '草稿',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: '待審閱',
      },
      {
        id: 'test-contract-001',
        name: 'Contract - Building Agreement.pdf',
        type: 'file',
        size: 256000,
        contentType: 'application/pdf',
        timeCreated: '2024-01-03T00:00:00Z',
        updated: '2024-01-17T09:15:00Z',
        description: '建築合約',
        version: 'V3',
        indicator: '--',
        tag: '合約',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: '已審閱',
      },
      {
        id: 'test-report-001',
        name: 'Monthly Progress Report.pdf',
        type: 'file',
        size: 128000,
        contentType: 'application/pdf',
        timeCreated: '2024-01-04T00:00:00Z',
        updated: '2024-01-18T16:45:00Z',
        description: '月度進度報告',
        version: 'V1',
        indicator: '--',
        tag: '報告',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: '--',
      }
    ];

    return [...realFiles, ...testFiles];
  }, [rawFiles]);

  // 過濾文件
  const filteredFiles = useMemo(() => {
    let filtered = files;

    // 基本搜尋過濾
    if (currentFilters.searchQuery.trim()) {
      const query = currentFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(query) ||
        (currentFilters.includeContent && file.description?.toLowerCase().includes(query))
      );
    }

    // 類型過濾
    if (currentFilters.type) {
      filtered = filtered.filter(file => file.type === currentFilters.type);
    }

    // 檔案類型過濾
    if (currentFilters.fileType) {
      filtered = filtered.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        switch (currentFilters.fileType) {
          case 'pdf': return extension === 'pdf';
          case 'dwg': return extension === 'dwg';
          case 'docx': return extension === 'docx';
          case 'xlsx': return extension === 'xlsx';
          case 'image': return ['jpg', 'jpeg', 'png', 'gif'].includes(extension || '');
          default: return true;
        }
      });
    }

    // 審閱狀態過濾
    if (currentFilters.reviewStatus) {
      filtered = filtered.filter(file => file.reviewStatus === currentFilters.reviewStatus);
    }

    // 更新者過濾
    if (currentFilters.updater) {
      filtered = filtered.filter(file => file.updater === currentFilters.updater);
    }

    return filtered;
  }, [files, currentFilters]);

  // 載入文件列表
  useEffect(() => {
    listFiles(spaceId, userId);
  }, [spaceId, userId, listFiles]);

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      // 處理文件夾點擊
      console.log('Folder clicked:', item.name);
    } else {
      // 處理文件點擊
      console.log('File clicked:', item.name);
    }
  };

  const handleItemAction = (item: FileItem, action: string) => {
    setContextMenuItem(item);
    
    switch (action) {
      case 'menu':
        // 上下文菜單已通過 ContextMenu 組件處理
        break;
      case 'download':
        downloadFile(item.name, spaceId, userId);
        break;
      case 'delete':
        deleteFile(item.name, spaceId, userId);
        break;
      case 'move':
        console.log('Move item:', item.name);
        break;
      case 'rename':
        console.log('Rename item:', item.name);
        break;
      case 'share':
        console.log('Share item:', item.name);
        break;
      case 'version-history':
        setSelectedFileForVersion(item);
        setIsVersionDrawerOpen(true);
        break;
      default:
        console.log('Action:', action, 'for item:', item.name);
    }
  };

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case 'upload':
        setIsUploadDialogOpen(true);
        break;
      case 'move':
        console.log('Move selected items:', selectedItems);
        break;
      case 'more-options':
        console.log('More options');
        break;
      case 'export':
        console.log('Export files');
        break;
      default:
        console.log('Toolbar action:', action);
    }
  };

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      await uploadFile(file, spaceId, userId);
    }
    setIsUploadDialogOpen(false);
  };

  // 拖拽上傳處理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleUpload(files);
    }
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenuItem) return;
    
    handleItemAction(contextMenuItem, action);
    setContextMenuItem(null);
  };

  // 篩選處理函數
  const handleFilterApply = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    setIsFilterPanelOpen(false);
  };

  const handleSaveSearch = (filters: FilterOptions, name: string) => {
    // 這裡可以實現儲存搜尋到本地儲存或後端
    console.log('Saving search:', name, filters);
  };

  const handleFilterToggle = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  // 麵包屑處理函數
  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    console.log('Breadcrumb clicked:', item);
    // 這裡可以實現導航邏輯
  };

  // 刪除項目處理函數
  const handleDeletedItemsToggle = () => {
    setIsDeletedItemsOpen(!isDeletedItemsOpen);
  };

  const handleRestoreItem = (item: any) => {
    console.log('Restore item:', item);
    // 這裡可以實現還原邏輯
  };

  const handlePermanentDelete = (item: any) => {
    console.log('Permanent delete item:', item);
    // 這裡可以實現永久刪除邏輯
  };

  return (
    <div 
      className={`h-full flex flex-col relative ${isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 拖拽上傳提示 */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50/90 border-2 border-dashed border-blue-400 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-4xl mb-4">📁</div>
            <div className="text-lg font-semibold text-blue-600">放開檔案以上傳</div>
            <div className="text-sm text-blue-500">將檔案拖曳至此處</div>
          </div>
        </div>
      )}

      {/* 工具欄 */}
      <Toolbar
        onUpload={() => handleToolbarAction('upload')}
        onMove={() => handleToolbarAction('move')}
        onMoreOptions={() => handleToolbarAction('more-options')}
        onExport={() => handleToolbarAction('export')}
        onSearch={setSearchQuery}
        onViewChange={setCurrentView}
        onFilter={handleFilterToggle}
        onDeletedItems={handleDeletedItemsToggle}
        currentView={currentView}
        selectedCount={selectedItems.length}
        isFilterActive={isFilterPanelOpen}
      />

      {/* 麵包屑導航 */}
      <div className="px-4 py-2 border-b bg-muted/10">
        <BreadcrumbNavigation
          items={breadcrumbItems}
          onItemClick={handleBreadcrumbClick}
        />
      </div>

      {/* 主內容區 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左側文件夾樹 */}
        <div className="w-80 border-r bg-muted/20">
          <div className="p-4">
            <FolderTree
              files={filteredFiles}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              onItemClick={handleItemClick}
              onItemAction={handleItemAction}
            />
          </div>
        </div>

        {/* 右側文件表格 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {filteredFiles.length === 0 ? (
            <EmptyFolderState 
              onUpload={() => handleToolbarAction('upload')}
              folderName="專案檔案"
            />
          ) : (
            <>
              <div className="flex-1 overflow-auto p-4">
                <FileTable
                  files={filteredFiles}
                  selectedItems={selectedItems}
                  onSelectionChange={setSelectedItems}
                  onItemClick={handleItemClick}
                  onItemAction={handleItemAction}
                />
              </div>

              {/* 底部狀態欄 */}
              <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/20">
                <div className="text-sm text-muted-foreground">
                  顯示 {filteredFiles.length} 個項目
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-muted rounded">
                    ←
                  </button>
                  <button className="p-1 hover:bg-muted rounded">
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 篩選面板 */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApply={handleFilterApply}
        onSave={handleSaveSearch}
        initialFilters={currentFilters}
      />

      {/* 刪除的項目 */}
      <DeletedItems
        isOpen={isDeletedItemsOpen}
        onClose={() => setIsDeletedItemsOpen(false)}
        onRestore={handleRestoreItem}
        onPermanentDelete={handlePermanentDelete}
      />

      {/* 上傳對話框 */}
      <UploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUpload}
        uploadProgress={uploadProgress?.progress || 0}
        isUploading={isLoading}
      />

      {/* 版本歷史記錄抽屜 */}
      <VersionHistoryDrawer
        isOpen={isVersionDrawerOpen}
        onClose={() => {
          setIsVersionDrawerOpen(false);
          setSelectedFileForVersion(null);
        }}
        versions={selectedFileForVersion ? [
          {
            id: '1',
            version: 'V1',
            name: selectedFileForVersion.name,
            indicator: selectedFileForVersion.indicator || '--',
            tag: selectedFileForVersion.tag || '--',
            updatedAt: selectedFileForVersion.updated,
            updatedBy: selectedFileForVersion.updater || 'ACC Sample P...',
            description: selectedFileForVersion.description || '--'
          }
        ] : []}
        currentFile={selectedFileForVersion ? {
          name: selectedFileForVersion.name,
          version: selectedFileForVersion.version || 'V1'
        } : undefined}
      />

      {/* 上下文菜單 */}
      {contextMenuItem && (
        <ContextMenu
          item={contextMenuItem}
          onAction={handleContextMenuAction}
        >
          <div />
        </ContextMenu>
      )}
    </div>
  );
}
