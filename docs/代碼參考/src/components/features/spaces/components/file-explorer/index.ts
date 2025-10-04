/**
 * @fileoverview Barrel file for the file explorer feature.
 * It re-exports all the components that make up the file explorer,
 * making it easy to import them from a single, consistent path.
 */
// File Explorer components exports
export { FileExplorer } from './file-explorer';
export { FolderTree, type FileItem } from './folder-tree';
export { FileTable } from './file-table';
export { ContextMenu, ToolbarContextMenu } from './context-menu';
export { Toolbar } from './toolbar';
export { UploadDialog } from './upload-dialog';
export { VersionHistoryDrawer, type VersionItem } from './version-history-drawer';
export { ColumnSettingsMenu, type ColumnConfig } from './column-settings-menu';

// Thumbnail view components
export { FileThumbnailGrid } from './thumbnail/file-thumbnail-grid';
export { FileThumbnailCard } from './thumbnail/file-thumbnail-card';
export { FileTypeIcon } from '@/components/ui/file-type-icon';

// Detail view components
export { FileDetailView } from './detail/file-detail-view';

// Services
export { FilePreviewServiceFactory } from './services/file-preview-service';

// Hooks and Context
export { 
  FileExplorerProvider, 
  useFileExplorerContext,
  useViewMode,
  useSelection,
  useDetailView,
  useFileExplorerUI
} from './hooks/use-file-explorer-context';