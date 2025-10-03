/**
 * @fileoverview Barrel file for exporting all custom hooks within the 'spaces' feature.
 * This provides a single, convenient entry point for importing any space-related
 * hooks, such as those for handling actions, into other components.
 */

// TODO: [P2] REFACTOR src/components/features/spaces/hooks/ - 簡化 hooks 邏輯
// 問題：多個 hooks 文件可能包含重複邏輯
// 影響：代碼重複、狀態管理複雜
// 建議：
// 1) 合併相似的 hooks 邏輯
// 2) 使用 React 19 的新 hooks 特性
// 3) 實現更簡單的狀態管理模式
// 4) 減少不必要的 useEffect 使用
// @assignee frontend-team
// @deadline 2025-02-05
// Spaces feature hooks exports
export { useSpaceActions } from './use-space-actions';
export { useFileActions } from './use-file-actions';
export { useStarActions } from './use-star-actions';
export { useVisibilityActions } from './use-visibility-actions';
