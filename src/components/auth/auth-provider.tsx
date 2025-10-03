/**
 * @fileoverview 統一認證與權限管理系統
 * 提供權限守護和管理的核心功能
 * 遵循奧卡姆剃刀原則，提供最簡潔實用的實現
 */
/* TODO: [P1] [BUG] [AUTH] [TODO] 修復 UTF-8 編碼問題 - 文件包含無效的 UTF-8 字符，導致構建失敗 */

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

// 認證狀態介面
interface AuthState {
  userId: string | null;
  userRoleAssignment: UserRoleAssignment | null;
  isLoading: boolean;
  error: string | null;
}

// 認證操作介面
interface AuthActions {
  setUser: (userId: string, roleAssignment: UserRoleAssignment) => void;
  clearUser: () => void;
  checkPermission: (permission: Permission, spaceId: string) => Promise<PermissionCheckResult>;
  hasPermission: (permission: Permission, spaceId: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

// 完整認證上下文
interface AuthContext extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContext | undefined>(undefined);

// 認證提供者屬性
export interface AuthProviderProps {
  children: ReactNode;
  initialUserId?: string;
}

// 認證提供者組件
export function AuthProvider({ children, initialUserId }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    userId: initialUserId || null,
    userRoleAssignment: null,
    isLoading: false,
    error: null,
  });

  // 設置用戶
  const setUser = (userId: string, roleAssignment: UserRoleAssignment) => {
    setState(prev => ({
      ...prev,
      userId,
      userRoleAssignment: roleAssignment,
      error: null,
    }));
  };

  // 清除用戶
  const clearUser = () => {
    setState(prev => ({
      ...prev,
      userId: null,
      userRoleAssignment: null,
      error: null,
    }));
  };

  // 檢查權限
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

  // 快速同步檢查
  const hasPermission = (permission: Permission, spaceId: string): boolean => {
    if (!state.userId || !state.userRoleAssignment) {
      return false;
    }

    // 簡化的同步權限檢查
    const spaceRole = state.userRoleAssignment.spaceRoles[spaceId];
    if (spaceRole) {
      const roleDef = roleManagementService.getRoleDefinition(spaceRole.roleId);
      if (roleDef && roleDef.permissions.includes(permission)) {
        return true;
      }
    }

    // 檢查組織角色
    for (const orgRole of state.userRoleAssignment.organizationRoles) {
      const roleDef = roleManagementService.getRoleDefinition(orgRole.roleId);
      if (roleDef && roleDef.permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  };

  // 刷新權限
  const refreshPermissions = async () => {
    if (!state.userId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: 從服務器獲取用戶角色分配
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

// 使用認證上下文的 hook
export function useAuth(): AuthContext {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 權限守護組件
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

// 權限按鈕組件
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