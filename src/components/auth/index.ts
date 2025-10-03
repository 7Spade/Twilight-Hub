/**
 * @fileoverview Auth 組件統�?導出
 * ?��??�?��?證�?權�??��?組件
 */

// 統�??��?證�?供�?
export { 
  AuthProvider, 
  useAuth,
  PermissionGuard,
  PermissionButton,
  type AuthProviderProps,
  type PermissionGuardProps,
  type PermissionButtonProps
} from './auth-provider';

// 角色管�?組件
export { RoleManager, PermissionDisplay } from './role-manager';

// ?��??�容?��??��??�步棄用�?
export { PermissionGuard as PermissionGuardLegacy } from './permission-guard';
