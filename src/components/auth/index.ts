/**
 * @fileoverview Auth çµ„ä»¶çµ±ä?å°å‡º
 * ?´å??€?‰è?è­‰å?æ¬Šé??¸é?çµ„ä»¶
 */

// çµ±ä??„è?è­‰æ?ä¾›è€?
export { 
  AuthProvider, 
  useAuth,
  PermissionGuard,
  PermissionButton,
  type AuthProviderProps,
  type PermissionGuardProps,
  type PermissionButtonProps
} from './auth-provider';

// è§’è‰²ç®¡ç?çµ„ä»¶
export { RoleManager, PermissionDisplay } from './role-manager';

// ?‘å??¼å®¹?„å??ºï??æ­¥æ£„ç”¨ï¼?
export { PermissionGuard as PermissionGuardLegacy } from './permission-guard';
