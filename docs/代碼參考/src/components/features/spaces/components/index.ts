/**
 * @fileoverview Barrel file for all components related to the 'spaces' feature.
 * This simplifies importing space-related components into other parts of the application
 * by providing a single, consistent path.
 */

// TODO: [P1] REFACTOR src/components/features/spaces/components/ - 減少過度抽象的組件層級
// 問題：70 個文件過度拆分，造成不必要的複雜性
// 影響：導入路徑過長、維護成本高、認知負擔重
// 建議：
// 1) 合併功能相似的組件（如多個 list 組件）
// 2) 簡化目錄結構，減少嵌套層級
// 3) 移除不必要的 barrel exports
// 4) 遵循 Next.js 15 組件組合模式
// @assignee frontend-team
// @deadline 2025-01-20

// TODO: [P2] REFACTOR src/components/features/spaces/components/ - 合併重複的組件邏輯
// 問題：多個 list/card/dialog 組件存在重複邏輯
// 影響：代碼重複、維護困難、一致性問題
// 建議：
// 1) 創建通用的 List/Card/Dialog 基礎組件
// 2) 使用 TypeScript 泛型提高類型安全
// 3) 實現組合模式而非繼承
// 4) 遵循 DRY 原則和奧卡姆剃刀
// @assignee frontend-team
// @deadline 2025-01-30
// Spaces feature components exports
export { SpaceCreateDialog } from './spaces-create-dialog';
export { SpacesDetailView } from './spaces-detail-view';
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
