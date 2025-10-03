/**
 * @fileoverview The main container component for the entire file explorer interface.
 * It orchestrates all the sub-components, including the toolbar, folder tree,
 * file table, and various dialogs/panels. It manages the overall state, such as
 * selected items, search queries, and view modes, and handles data fetching
 * and user actions.
 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFileActions } from '@/components/features/spaces/hooks';
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
    { id: 'project-files', name: 'Â∞àÊ?Ê™îÊ?' }
  ]);
  const [isDeletedItemsOpen, setIsDeletedItemsOpen] = useState(false);

  // ËΩâÊ??üÂ??á‰ª∂?∏Ê???FileItem ?ºÂ?Ôºå‰∏¶Ê∑ªÂ?‰∏Ä‰∫õÊ∏¨Ë©¶Ê?Ê°?  const files: FileItem[] = useMemo(() => {
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

    // Ê∑ªÂ?‰∏Ä‰∫õÊ∏¨Ë©¶Ê?Ê°à‰ª•‰æøÂ?Á§∫Êî∂?àÂ???    const testFiles: FileItem[] = [
      {
        id: 'test-arch-001',
        name: 'A000 - ARCHITECTURAL DRAWING.pdf',
        type: 'file',
        size: 1024000,
        contentType: 'application/pdf',
        timeCreated: '2024-01-01T00:00:00Z',
        updated: '2024-01-15T10:30:00Z',
        description: 'Âª∫Á?Âπ≥Èù¢??,
        version: 'V2',
        indicator: '--',
        tag: '?çË?',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: 'Â∑≤ÂØ©??,
      },
      {
        id: 'test-office-001',
        name: 'A100 - OFFICE - FLOOR PLAN.dwg',
        type: 'file',
        size: 512000,
        contentType: 'application/dwg',
        timeCreated: '2024-01-02T00:00:00Z',
        updated: '2024-01-16T14:20:00Z',
        description: 'Ëæ¶ÂÖ¨ÂÆ§Âπ≥?¢Â?',
        version: 'V1',
        indicator: '--',
        tag: '?âÁ®ø',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: 'ÂæÖÂØ©??,
      },
      {
        id: 'test-contract-001',
        name: 'Contract - Building Agreement.pdf',
        type: 'file',
        size: 256000,
        contentType: 'application/pdf',
        timeCreated: '2024-01-03T00:00:00Z',
        updated: '2024-01-17T09:15:00Z',
        description: 'Âª∫Á??àÁ?',
        version: 'V3',
        indicator: '--',
        tag: '?àÁ?',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: 'Â∑≤ÂØ©??,
      },
      {
        id: 'test-report-001',
        name: 'Monthly Progress Report.pdf',
        type: 'file',
        size: 128000,
        contentType: 'application/pdf',
        timeCreated: '2024-01-04T00:00:00Z',
        updated: '2024-01-18T16:45:00Z',
        description: '?àÂ∫¶?≤Â∫¶?±Â?',
        version: 'V1',
        indicator: '--',
        tag: '?±Â?',
        issue: '--',
        updater: 'ACC Sample P...',
        versionContributor: '--',
        reviewStatus: '--',
      }
    ];

    return [...realFiles, ...testFiles];
  }, [rawFiles]);

  // ?éÊøæ?á‰ª∂
  const filteredFiles = useMemo(() => {
    let filtered = files;

    // ?∫Êú¨?úÂ??éÊøæ
    if (currentFilters.searchQuery.trim()) {
      const query = currentFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(query) ||
        (currentFilters.includeContent && file.description?.toLowerCase().includes(query))
      );
    }

    // È°ûÂ??éÊøæ
    if (currentFilters.type) {
      filtered = filtered.filter(file => file.type === currentFilters.type);
    }

    // Ê™îÊ?È°ûÂ??éÊøæ
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

    // ÂØ©Èñ±?Ä?ãÈ?Êø?    if (currentFilters.reviewStatus) {
      filtered = filtered.filter(file => file.reviewStatus === currentFilters.reviewStatus);
    }

    // ?¥Êñ∞?ÖÈ?Êø?    if (currentFilters.updater) {
      filtered = filtered.filter(file => file.updater === currentFilters.updater);
    }

    return filtered;
  }, [files, currentFilters]);

  // ËºâÂÖ•?á‰ª∂?óË°®
  useEffect(() => {
    listFiles(spaceId, userId);
  }, [spaceId, userId, listFiles]);

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      // ?ïÁ??á‰ª∂Â§æÈ???      console.log('Folder clicked:', item.name);
    } else {
      // ?ïÁ??á‰ª∂ÈªûÊ?
      console.log('File clicked:', item.name);
    }
  };

  const handleItemAction = (item: FileItem, action: string) => {
    setContextMenuItem(item);
    
    switch (action) {
      case 'menu':
        // ‰∏ä‰??áË??ÆÂ∑≤?öÈ? ContextMenu ÁµÑ‰ª∂?ïÁ?
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

  // ?ñÊãΩ‰∏äÂÇ≥?ïÁ?
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

  // ÁØ©ÈÅ∏?ïÁ??ΩÊï∏
  const handleFilterApply = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    setIsFilterPanelOpen(false);
  };

  const handleSaveSearch = (filters: FilterOptions, name: string) => {
    // ?ôË£°?Ø‰ª•ÂØ¶Áèæ?≤Â??úÂ??∞Êú¨?∞ÂÑ≤Â≠òÊ?ÂæåÁ´Ø
    console.log('Saving search:', name, filters);
  };

  const handleFilterToggle = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  // È∫µÂ?Â±ëË??ÜÂáΩ??  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    console.log('Breadcrumb clicked:', item);
    // ?ôË£°?Ø‰ª•ÂØ¶ÁèæÂ∞éËà™?èËºØ
  };

  // ?™Èô§?ÖÁõÆ?ïÁ??ΩÊï∏
  const handleDeletedItemsToggle = () => {
    setIsDeletedItemsOpen(!isDeletedItemsOpen);
  };

  const handleRestoreItem = (item: any) => {
    console.log('Restore item:', item);
    // ?ôË£°?Ø‰ª•ÂØ¶Áèæ?ÑÂ??èËºØ
  };

  const handlePermanentDelete = (item: any) => {
    console.log('Permanent delete item:', item);
    // ?ôË£°?Ø‰ª•ÂØ¶ÁèæÊ∞∏‰??™Èô§?èËºØ
  };

  return (
    <div 
      className={`h-full flex flex-col relative ${isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ?ñÊãΩ‰∏äÂÇ≥?êÁ§∫ */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50/90 border-2 border-dashed border-blue-400 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-4xl mb-4">??</div>
            <div className="text-lg font-semibold text-blue-600">?æÈ?Ê™îÊ?‰ª•‰???/div>
            <div className="text-sm text-blue-500">Â∞áÊ?Ê°àÊ??≥Ëá≥Ê≠§Ë?</div>
          </div>
        </div>
      )}

      {/* Â∑•ÂÖ∑Ê¨?*/}
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

      {/* È∫µÂ?Â±ëÂ???*/}
      <div className="px-4 py-2 border-b bg-muted/10">
        <BreadcrumbNavigation
          items={breadcrumbItems}
          onItemClick={handleBreadcrumbClick}
        />
      </div>

      {/* ‰∏ªÂÖßÂÆπÂ? */}
      <div className="flex-1 flex overflow-hidden">
        {/* Â∑¶ÂÅ¥?á‰ª∂Â§æÊ®π */}
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

        {/* ?≥ÂÅ¥?á‰ª∂Ë¶ñÂ? */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {filteredFiles.length === 0 ? (
            <EmptyFolderState 
              onUpload={() => handleToolbarAction('upload')}
              folderName="Â∞àÊ?Ê™îÊ?"
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

              {/* Â∫ïÈÉ®?Ä?ãÊ? */}
              <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/20">
                <div className="text-sm text-muted-foreground">
                  È°ØÁ§∫ {filteredFiles.length} ?ãÈ?????{currentView === 'list' ? '?óË°®Ë¶ñÂ?' : 'Á∏ÆÂ?Ë¶ñÂ?'}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-muted rounded">
                    ??                  </button>
                  <button className="p-1 hover:bg-muted rounded">
                    ??                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ÁØ©ÈÅ∏?¢Êùø */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApply={handleFilterApply}
        onSave={handleSaveSearch}
        initialFilters={currentFilters}
      />

      {/* ?™Èô§?ÑÈ???*/}
      <DeletedItems
        isOpen={isDeletedItemsOpen}
        onClose={() => setIsDeletedItemsOpen(false)}
        onRestore={handleRestoreItem}
        onPermanentDelete={handlePermanentDelete}
      />

      {/* ‰∏äÂÇ≥Â∞çË©±Ê°?*/}
      <UploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUpload}
        uploadProgress={uploadProgress?.progress || 0}
        isUploading={isLoading}
      />

      {/* ?àÊú¨Ê≠∑Âè≤Ë®òÈ??ΩÂ? */}
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

      {/* Ë©≥Á¥∞Ë¶ñÂ? */}
      <FileDetailView
        file={detailViewFile}
        isOpen={isDetailViewOpen}
        onClose={closeDetailView}
        onDownload={(file) => downloadFile(file.name, spaceId, userId)}
        onShare={(file) => console.log('Share file:', file.name)}
        onEdit={(file) => console.log('Edit file:', file.name)}
        onDelete={(file) => deleteFile(file.name, spaceId, userId)}
        onStar={(file) => console.log('Star file:', file.name)}
      />

      {/* ‰∏ä‰??áË???*/}
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
