/**
 * @fileoverview Hooks 統一導出
 * 整合所有自定義 hooks，提供清晰的 API
 */

// 應用狀態管理
export { 
  AppStateProvider, 
  useAppState, 
  useChatState, 
  useDialogState 
} from './use-app-state';

// 權限管理
export { usePermissions, useRoleManagement, usePermissionGuard } from './use-permissions';

// UI 狀態管理
export { useToast } from './use-toast';
export { useIsMobile } from './use-mobile';

