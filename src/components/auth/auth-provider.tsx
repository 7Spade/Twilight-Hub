/**
 * @fileoverview çµ±ä??„è?è­‰å?æ¬Šé?ç®¡ç??ä??? * ?´å?æ¬Šé?å®ˆè??Œè??²ç®¡?†å??? * ?µå¾ªå¥§å¡å§†å??€?Ÿå?ï¼Œæ?ä¾›æ?ç°¡æ??„å¯¦?? */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Permission, 
  UserRoleAssignment, 
  PermissionCheckResult,
  OrganizationRole,
  SpaceRole 
} from '@/lib/types-unified';
import { roleManagementService } from '@/lib/role-management';

// èªè??€?‹æ¥??interface AuthState {
  userId: string | null;
  userRoleAssignment: UserRoleAssignment | null;
  isLoading: boolean;
  error: string | null;
}

// èªè??ä??¥å£
interface AuthActions {
  setUser: (userId: string, roleAssignment: UserRoleAssignment) => void;
  clearUser: () => void;
  checkPermission: (permission: Permission, spaceId: string) => Promise<PermissionCheckResult>;
  hasPermission: (permission: Permission, spaceId: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

// å®Œæ•´?„è?è­‰ä?ä¸‹æ?
interface AuthContext extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContext | undefined>(undefined);

// èªè??ä??…å±¬??export interface AuthProviderProps {
  children: ReactNode;
  initialUserId?: string;
}

// èªè??ä??…ç?ä»?export function AuthProvider({ children, initialUserId }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    userId: initialUserId || null,
    userRoleAssignment: null,
    isLoading: false,
    error: null,
  });

  // è¨­ç½®?¨æˆ¶
  const setUser = (userId: string, roleAssignment: UserRoleAssignment) => {
    setState(prev => ({
      ...prev,
      userId,
      userRoleAssignment: roleAssignment,
      error: null,
    }));
  };

  // æ¸…é™¤?¨æˆ¶
  const clearUser = () => {
    setState(prev => ({
      ...prev,
      userId: null,
      userRoleAssignment: null,
      error: null,
    }));
  };

  // æª¢æŸ¥æ¬Šé?
  const checkPermission = async (permission: Permission, spaceId: string): Promise<PermissionCheckResult> => {
    if (!state.userId || !state.userRoleAssignment) {
      return {
        hasPermission: false,
        reason: 'not_assigned',
        source: 'space',
        roleId: undefined,
      };
    }

    try {
      return await roleManagementService.checkPermission(
        state.userId,
        spaceId,
        permission,
        state.userRoleAssignment
      );
    } catch (error) {
      console.error('Permission check failed:', error);
      return {
        hasPermission: false,
        reason: 'denied',
        source: 'space',
        roleId: undefined,
      };
    }
  };

  // å¿«é€Ÿæ??æª¢??  const hasPermission = (permission: Permission, spaceId: string): boolean => {
    if (!state.userId || !state.userRoleAssignment) {
      return false;
    }

    // ç°¡å??„å?æ­¥æ??æª¢??    const spaceRole = state.userRoleAssignment.spaceRoles[spaceId];
    if (spaceRole) {
      const roleDef = roleManagementService.getRoleDefinition(spaceRole.roleId);
      if (roleDef && roleDef.permissions.includes(permission)) {
        return true;
      }
    }

    // æª¢æŸ¥çµ„ç?è§’è‰²
    for (const orgRole of state.userRoleAssignment.organizationRoles) {
      const roleDef = roleManagementService.getRoleDefinition(orgRole.roleId);
      if (roleDef && roleDef.permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  };

  // ?·æ–°æ¬Šé?
  const refreshPermissions = async () => {
    if (!state.userId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: å¾æ??™å™¨?²å??€?°ç?è§’è‰²?†é?
      // const roleAssignment = await fetchUserRoleAssignment(state.userId);
      // setState(prev => ({ ...prev, userRoleAssignment: roleAssignment }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to refresh permissions' 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const value: AuthContext = {
    ...state,
    setUser,
    clearUser,
    checkPermission,
    hasPermission,
    refreshPermissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ä½¿ç”¨èªè??€?‹ç? hook
export function useAuth(): AuthContext {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// æ¬Šé?å®ˆè?çµ„ä»¶
interface PermissionGuardProps {
  permission: Permission;
  spaceId: string;
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export function PermissionGuard({
  permission,
  spaceId,
  children,
  fallback = null,
  loading = <div className="animate-pulse bg-muted h-4 w-20 rounded" />
}: PermissionGuardProps) {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return <>{loading}</>;
  }

  if (!hasPermission(permission, spaceId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// æ¬Šé??‰é?çµ„ä»¶
interface PermissionButtonProps extends PermissionGuardProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function PermissionButton({
  permission,
  spaceId,
  children,
  onClick,
  disabled = false,
  className = '',
  fallback = null
}: PermissionButtonProps) {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return (
      <button disabled className={className}>
        {children}
      </button>
    );
  }

  if (!hasPermission(permission, spaceId)) {
    return <>{fallback}</>;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}
