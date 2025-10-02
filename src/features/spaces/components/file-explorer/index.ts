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
