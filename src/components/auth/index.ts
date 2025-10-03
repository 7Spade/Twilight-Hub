/**
 * @fileoverview Auth 組件統一導出
 * 包含所有認證和權限相關組件
 */

// 統一認證提供者
export { 
  AuthProvider, 
  useAuth,
  PermissionGuard,
  PermissionButton,
  type AuthProviderProps,
  type PermissionGuardProps,
  type PermissionButtonProps
} from './auth-provider';

// 角色管理組件
export { RoleManager, PermissionDisplay } from './role-manager';

// 舊版本相容性（逐步棄用）
export { PermissionGuard as PermissionGuardLegacy } from './permission-guard';