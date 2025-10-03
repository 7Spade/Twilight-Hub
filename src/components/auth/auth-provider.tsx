/**
 * @fileoverview Unified Authentication and Permission Management System
 * Provides core functionality for permission guards and management
 * Follows Occam's Razor principle for minimal and practical implementation
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Permission, 
  UserRoleAssignment, 
  PermissionCheckResult,
  OrganizationRole,
  SpaceRole 
} from '@/lib/types-unified';
/* TODO: [P2] [CLEANUP] [UI] [TODO] Clean up unused imports - useEffect, OrganizationRole, SpaceRole are not used */
import { roleManagementService } from '@/lib/role-management';

// Authentication state interface
interface AuthState {
  userId: string | null;
  userRoleAssignment: UserRoleAssignment | null;
  isLoading: boolean;
  error: string | null;
}

// Authentication actions interface
interface AuthActions {
  setUser: (userId: string, roleAssignment: UserRoleAssignment) => void;
  clearUser: () => void;
  checkPermission: (permission: Permission, spaceId: string) => Promise<PermissionCheckResult>;
  hasPermission: (permission: Permission, spaceId: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

// Complete authentication context
interface AuthContext extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContext | undefined>(undefined);

// Authentication provider props
export interface AuthProviderProps {
  children: ReactNode;
  initialUserId?: string;
}

// Authentication provider component
export function AuthProvider({ children, initialUserId }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    userId: initialUserId || null,
    userRoleAssignment: null,
    isLoading: false,
    error: null,
  });

  // Set user
  const setUser = (userId: string, roleAssignment: UserRoleAssignment) => {
    setState(prev => ({
      ...prev,
      userId,
      userRoleAssignment: roleAssignment,
      error: null,
    }));
  };

  // Clear user
  const clearUser = () => {
    setState(prev => ({
      ...prev,
      userId: null,
      userRoleAssignment: null,
      error: null,
    }));
  };

  // Check permission
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

  // Quick synchronous check
  const hasPermission = (permission: Permission, spaceId: string): boolean => {
    if (!state.userId || !state.userRoleAssignment) {
      return false;
    }

    // Simplified synchronous permission check
    const spaceRole = state.userRoleAssignment.spaceRoles[spaceId];
    if (spaceRole) {
      const roleDef = roleManagementService.getRoleDefinition(spaceRole.roleId);
      if (roleDef && roleDef.permissions.includes(permission)) {
        return true;
      }
    }

    // Check organization roles
    for (const orgRole of state.userRoleAssignment.organizationRoles) {
      const roleDef = roleManagementService.getRoleDefinition(orgRole.roleId);
      if (roleDef && roleDef.permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  };

  // Refresh permissions
  const refreshPermissions = async () => {
    if (!state.userId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: [P1] FEAT src/components/auth/auth-provider.tsx - 從伺服器獲取用戶角色分配
      // const roleAssignment = await fetchUserRoleAssignment(state.userId);
      // setState(prev => ({ ...prev, userRoleAssignment: roleAssignment }));
      // @assignee dev
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

// Hook to use authentication context
export function useAuth(): AuthContext {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Permission guard component
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

// Permission button component
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