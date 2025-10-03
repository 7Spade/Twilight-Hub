/**
 * @fileoverview Auth 組件統一導出
 * 提供認證和權限相關組件
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

// 向後兼容，暫時保留
export { PermissionGuard as PermissionGuardLegacy } from './permission-guard';