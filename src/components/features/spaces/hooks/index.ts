/**
 * @fileoverview Barrel file for exporting all custom hooks within the 'spaces' feature.
 * This provides a single, convenient entry point for importing any space-related
 * hooks, such as those for handling actions, into other components.
 */
// Spaces feature hooks exports
export { useSpaceActions } from './use-space-actions';
export { useFileActions } from './use-file-actions';
export { useStarActions } from './use-star-actions';
export { useVisibilityActions } from './use-visibility-actions';
