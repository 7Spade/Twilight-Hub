/**
 * @fileoverview The main container component for the entire file explorer interface.
 * It orchestrates all the sub-components, including the toolbar, folder tree,
 * file table, and various dialogs/panels. It manages the overall state, such as
 * selected items, search queries, and view modes, and handles data fetching
 * and user actions.
 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useFileActions } from '@/components/features/spaces/hooks';
import { FolderTree, type FileItem } from './folder-tree';
import { FileTable } from './file-table';
import { ContextMenu } from './context-menu';
import { Toolbar } from './toolbar';
import { UploadDialog } from './upload-dialog';
import { VersionHistoryDrawer } from './version-history-drawer';

// ✅ [COMPLETED] 已清理未使用的重命名導入
// 現代化改進：移除未使用的導入，降低認知負擔，減少 bundle 大小
// 效能提升：減少不必要的模組載入，提升 AI agent 代碼理解效率
// 建議：配置 ESLint no-unused-vars 規則自動檢測未使用的導入
import { EmptyFolderState } from './empty-folder-state';
import { FilterPanel, type FilterOptions } from './filter-panel';
import { BreadcrumbNavigation, type BreadcrumbItem } from './breadcrumb-navigation';
import { DeletedItems } from './deleted-items';
import { FileThumbnailGrid } from './thumbnail/file-thumbnail-grid';
import { FileDetailView } from './detail/file-detail-view';
import { FileExplorerProvider, useFileExplorerContext } from './hooks/use-file-explorer-context';

interface FileExplorerProps {
  spaceId: string;
  userId: string;
}

// Internal component that uses the context
function FileExplorerContent({ spaceId, userId }: FileExplorerProps) {
  const { 
    uploadFile, 
    downloadFile, 
    deleteFile, 
    listFiles, 
    isLoading, 
    uploadProgress,
    files: rawFiles 
  } = useFileActions();

  const { 
    currentView, 
    setCurrentView,
    selectedItems, 
    setSelectedItems, 
    openDetailView, 
    closeDetailView,
    detailViewFile,
    isDetailViewOpen 
  } = useFileExplorerContext();
  const [, setSearchQuery] = useState('');
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
  // TODO: 現代化 - 移除未使用的 setBreadcrumbItems 別名，簡化狀態管理
  const [breadcrumbItems] = useState<BreadcrumbItem[]>([
    { id: 'project-files', name: '專案檔案' }
  ]);
  const [isDeletedItemsOpen, setIsDeletedItemsOpen] = useState(false);

  // 轉換原始檔案為 FileItem 格式，並添加一些測試資料
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
        tag: '已審核',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: '已審核',
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
        reviewStatus: '待審核',
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
        tag: '已審核',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: '已審核',
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
        tag: '--',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: '--',
      }
    ];

    return [...realFiles, ...testFiles];
  }, [rawFiles]);

  // 篩選檔案
  const filteredFiles = useMemo(() => {
    let filtered = files;

    // 基本搜索篩選
    if (currentFilters.searchQuery.trim()) {
      const query = currentFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(query) ||
        (currentFilters.includeContent && file.description?.toLowerCase().includes(query))
      );
    }

    // 類型篩選
    if (currentFilters.type) {
      filtered = filtered.filter(file => file.type === currentFilters.type);
    }

    // 檔案類型篩選
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

    // 審閱狀態篩選
    if (currentFilters.reviewStatus) {
      filtered = filtered.filter(file => file.reviewStatus === currentFilters.reviewStatus);
    }

    // 更新者篩選
    if (currentFilters.updater) {
      filtered = filtered.filter(file => file.updater === currentFilters.updater);
    }

    return filtered;
  }, [files, currentFilters]);

  // 載入檔案列表
  useEffect(() => {
    listFiles(spaceId, userId);
  }, [spaceId, userId, listFiles]);

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      // 處理資料夾點擊
      // TODO: [P2] FEAT - 實現資料夾點擊導航邏輯 [低認知]
      // 問題：目前只有 console.log，沒有實際的導航功能
      // 解決方案：實現資料夾導航和狀態更新
      // 現代化建議：使用 Next.js router 或狀態管理進行導航
      // 效能影響：無，但提升用戶體驗
      // 相關受影響檔案：folder-tree.tsx, breadcrumb-navigation.tsx
      console.log('Folder clicked:', item.name);
    } else {
      // 處理檔案點擊
      // TODO: [P2] FEAT - 實現檔案點擊預覽邏輯 [低認知]
      // 問題：目前只有 console.log，沒有實際的檔案預覽功能
      // 解決方案：實現檔案預覽和詳細視圖
      // 現代化建議：使用動態導入和 Suspense 進行檔案預覽
      // 效能影響：無，但提升用戶體驗
      // 相關受影響檔案：file-detail-view.tsx, file-preview-service.ts
      console.log('File clicked:', item.name);
    }
  };

  const handleItemAction = (item: FileItem, action: string) => {
    setContextMenuItem(item);
    
    switch (action) {
      case 'menu':
        // 上下文選單已由 ContextMenu 組件處理
        break;
      case 'download':
        downloadFile(item.name, spaceId, userId);
        break;
      case 'delete':
        deleteFile(item.name, spaceId, userId);
        break;
      case 'move':
        // TODO: [P2] FEAT - 實現檔案移動功能 [低認知]
        // 問題：目前只有 console.log，沒有實際的移動功能
        // 解決方案：實現檔案移動到其他資料夾的功能
        // 現代化建議：使用拖拽 API 和狀態管理
        // 效能影響：無，但提升用戶體驗
        // 相關受影響檔案：file-actions.ts, folder-tree.tsx
        console.log('Move item:', item.name);
        break;
      case 'rename':
        // TODO: [P2] FEAT - 實現檔案重新命名功能 [低認知]
        // 問題：目前只有 console.log，沒有實際的重新命名功能
        // 解決方案：實現檔案重新命名對話框和狀態更新
        // 現代化建議：使用內聯編輯或對話框模式
        // 效能影響：無，但提升用戶體驗
        // 相關受影響檔案：file-actions.ts, context-menu.tsx
        console.log('Rename item:', item.name);
        break;
      case 'share':
        // TODO: [P2] FEAT - 實現檔案分享功能 [低認知]
        // 問題：目前只有 console.log，沒有實際的分享功能
        // 解決方案：實現檔案分享對話框和權限管理
        // 現代化建議：使用 Next.js API routes 和權限系統
        // 效能影響：無，但提升用戶體驗
        // 相關受影響檔案：file-actions.ts, share-dialog.tsx
        console.log('Share item:', item.name);
        break;
      case 'version-history':
        setSelectedFileForVersion(item);
        setIsVersionDrawerOpen(true);
        break;
      default:
        // TODO: [P2] FEAT - 實現通用檔案動作處理 [低認知]
        // 問題：目前只有 console.log，沒有實際的動作處理
        // 解決方案：實現通用的檔案動作處理邏輯
        // 現代化建議：使用策略模式或動作映射表
        // 效能影響：無，但提升用戶體驗
        // 相關受影響檔案：file-actions.ts, action-handlers.ts
        console.log('Action:', action, 'for item:', item.name);
    }
  };

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case 'upload':
        setIsUploadDialogOpen(true);
        break;
      case 'move':
        // TODO: [P2] FEAT - 實現批量檔案移動功能 [低認知]
        // 問題：目前只有 console.log，沒有實際的批量移動功能
        // 解決方案：實現批量檔案移動到其他資料夾的功能
        // 現代化建議：使用拖拽 API 和批量操作模式
        // 效能影響：無，但提升用戶體驗
        // 相關受影響檔案：file-actions.ts, batch-operations.ts
        console.log('Move selected items:', selectedItems);
        break;
      case 'more-options':
        // TODO: [P2] FEAT - 實現更多選項功能 [低認知]
        // 問題：目前只有 console.log，沒有實際的更多選項功能
        // 解決方案：實現更多選項的下拉選單或彈出視窗
        // 現代化建議：使用 DropdownMenu 組件和動態選項
        // 效能影響：無，但提升用戶體驗
        // 相關受影響檔案：toolbar.tsx, more-options-menu.tsx
        console.log('More options');
        break;
      case 'export':
        // TODO: [P2] FEAT - 實現檔案匯出功能 [低認知]
        // 問題：目前只有 console.log，沒有實際的匯出功能
        // 解決方案：實現檔案匯出對話框和格式選擇
        // 現代化建議：使用 Next.js API routes 和檔案下載
        // 效能影響：無，但提升用戶體驗
        // 相關受影響檔案：file-actions.ts, export-dialog.tsx
        console.log('Export files');
        break;
      default:
        // TODO: [P2] FEAT - 實現通用工具列動作處理 [低認知]
        // 問題：目前只有 console.log，沒有實際的動作處理
        // 解決方案：實現通用的工具列動作處理邏輯
        // 現代化建議：使用策略模式或動作映射表
        // 效能影響：無，但提升用戶體驗
        // 相關受影響檔案：toolbar.tsx, action-handlers.ts
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

  // 篩選面板處理
  const handleFilterApply = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    setIsFilterPanelOpen(false);
  };

  const handleSaveSearch = (filters: FilterOptions, name: string) => {
    // 這裡可以實現搜尋範本儲存到後端
    // TODO: [P2] FEAT - 實現搜尋範本儲存功能 [低認知]
    // 問題：目前只有 console.log，沒有實際的儲存功能
    // 解決方案：實現搜尋範本儲存到後端的功能
    // 現代化建議：使用 Next.js API routes 和 Firestore
    // 效能影響：無，但提升用戶體驗
    // 相關受影響檔案：filter-panel.tsx, search-templates.ts
    console.log('Saving search:', name, filters);
  };

  const handleFilterToggle = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  // 麵包屑處理函數
  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    // TODO: [P2] FEAT - 實現麵包屑導航功能 [低認知]
    // 問題：目前只有 console.log，沒有實際的導航功能
    // 解決方案：實現麵包屑點擊導航到對應路徑
    // 現代化建議：使用 Next.js router 或狀態管理
    // 效能影響：無，但提升用戶體驗
    // 相關受影響檔案：breadcrumb-navigation.tsx, navigation-state.ts
    console.log('Breadcrumb clicked:', item);
    // 這裡可以實現導航邏輯
  };

  // 刪除項目處理函數
  const handleDeletedItemsToggle = () => {
    setIsDeletedItemsOpen(!isDeletedItemsOpen);
  };

  const handleRestoreItem = (item: FileItem) => {
    // TODO: [P2] FEAT - 實現檔案還原功能 [低認知]
    // 問題：目前只有 console.log，沒有實際的還原功能
    // 解決方案：實現檔案從垃圾桶還原的功能
    // 現代化建議：使用 Next.js API routes 和 Firestore
    // 效能影響：無，但提升用戶體驗
    // 相關受影響檔案：deleted-items.tsx, file-actions.ts
    console.log('Restore item:', item);
  };

  const handlePermanentDelete = (item: FileItem) => {
    // TODO: [P2] FEAT - 實現檔案永久刪除功能 [低認知]
    // 問題：目前只有 console.log，沒有實際的永久刪除功能
    // 解決方案：實現檔案永久刪除的確認對話框和功能
    // 現代化建議：使用確認對話框和 API routes
    // 效能影響：無，但提升用戶體驗
    // 相關受影響檔案：deleted-items.tsx, file-actions.ts
    console.log('Permanent delete item:', item);
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
            <div className="text-4xl mb-4">↥</div>
            <div className="text-lg font-semibold text-blue-600">拖放檔案以上傳</div>
            <div className="text-sm text-blue-500">將檔案拖放至此</div>
          </div>
        </div>
      )}

      {/* 工具列 */}
      <Toolbar
        onUpload={() => handleToolbarAction('upload')}
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
        {/* 左側資料夾樹 */}
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

        {/* 右側檔案視圖 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {filteredFiles.length === 0 ? (
            <EmptyFolderState 
              onUpload={() => handleToolbarAction('upload')}
              folderName="專案檔案"
            />
          ) : (
            <>
              <div className="flex-1 overflow-auto p-4">
                {currentView === 'list' ? (
                  <FileTable
                    files={filteredFiles}
                    selectedItems={selectedItems}
                    onSelectionChange={setSelectedItems}
                    onItemClick={handleItemClick}
                    onItemAction={handleItemAction}
                  />
                ) : (
                  <FileThumbnailGrid
                    files={filteredFiles}
                    selectedItems={selectedItems}
                    onSelectionChange={setSelectedItems}
                    onItemClick={handleItemClick}
                    onItemDoubleClick={openDetailView}
                    containerHeight={600}
                  />
                )}
              </div>

              {/* 底部統計 */}
              <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/20">
                <div className="text-sm text-muted-foreground">
                  顯示 {filteredFiles.length} 個項目（{currentView === 'list' ? '列表視圖' : '縮圖視圖'}）
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-muted rounded">‹</button>
                  <button className="p-1 hover:bg-muted rounded">›</button>
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

      {/* 刪除項目 */}
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

      {/* 詳細視圖 */}
      <FileDetailView
        file={detailViewFile}
        isOpen={isDetailViewOpen}
        onClose={closeDetailView}
        onDownload={(file) => downloadFile(file.name, spaceId, userId)}
        onShare={(file) => {
          // TODO: [P2] FEAT - 實現檔案分享功能 [低認知]
          // 問題：目前只有 console.log，沒有實際的分享功能
          // 解決方案：實現檔案分享對話框和權限管理
          // 現代化建議：使用 Next.js API routes 和權限系統
          // 效能影響：無，但提升用戶體驗
          // 相關受影響檔案：share-dialog.tsx, file-actions.ts
          console.log('Share file:', file.name);
        }}
        onEdit={(file) => {
          // TODO: [P2] FEAT - 實現檔案編輯功能 [低認知]
          // 問題：目前只有 console.log，沒有實際的編輯功能
          // 解決方案：實現檔案編輯對話框和內容更新
          // 現代化建議：使用內聯編輯或編輯對話框
          // 效能影響：無，但提升用戶體驗
          // 相關受影響檔案：edit-dialog.tsx, file-actions.ts
          console.log('Edit file:', file.name);
        }}
        onDelete={(file) => deleteFile(file.name, spaceId, userId)}
        onStar={(file) => {
          // TODO: [P2] FEAT - 實現檔案標星功能 [低認知]
          // 問題：目前只有 console.log，沒有實際的標星功能
          // 解決方案：實現檔案標星/取消標星的功能
          // 現代化建議：使用狀態管理和視覺回饋
          // 效能影響：無，但提升用戶體驗
          // 相關受影響檔案：star-actions.ts, file-actions.ts
          console.log('Star file:', file.name);
        }}
      />

      {/* 上下文選單 */}
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

// Main component with provider
export function FileExplorer({ spaceId, userId }: FileExplorerProps) {
  return (
    <FileExplorerProvider initialView="list">
      <FileExplorerContent spaceId={spaceId} userId={userId} />
    </FileExplorerProvider>
  );
}