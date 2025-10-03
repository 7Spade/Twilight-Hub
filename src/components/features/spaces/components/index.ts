/**
 * @fileoverview Barrel file for all components related to the 'spaces' feature.
 * This simplifies importing space-related components into other parts of the application
 * by providing a single, consistent path.
 */
// Spaces feature components exports
export { SpaceCreateDialog } from './spaces-create-dialog';
export { SpaceDetailView } from './spaces-detail-view';
export { SpaceListView } from './spaces-list-view';
export { SpaceSettingsView, type SpaceSettingsFormValues } from './spaces-settings-view';
export { SpaceStarButton } from './spaces-star-button';
export { SpaceStarredView } from './spaces-starred-view';
export { SpaceVisibilityBadge } from './spaces-visibility-badge';
export { FileManager } from './spaces-files-view';
export * from './file-explorer';

// Tab components exports
export * from './overview';
export * from './participants';
export * from './issues';
export * from './quality';
export * from './report';
export * from './acceptance';
export * from './contracts';
