'use client';
// TODO: [P2] REFACTOR src/hooks/use-permissions.ts - 奧卡姆剃刀精簡權限 Hook
// 建議：
// 1) 將 checkOrganizationPermissionInternal 暴露為單一 memoized selector，避免多處 useCallback 依賴分散。
// 2) 僅回傳呼叫端實際需要的最小資料（布林/字串），降低重渲染與心智負擔。
// 3) 以穩定依賴陣列與衍生值 memo 化，移除多餘依賴導致的 hooks 警告。

import { useState, useCallback, useMemo } from 'react';
import { Permission, PermissionCheckResult, UserRoleAssignment } from '@/lib/types-unified';
import { useAuth } from '@/components/auth/auth-provider';
import { roleManagementService } from '@/lib/role-management';

/**
 * 權限檢查 Hook
 * 提供用戶權限檢查功能
 * 整合 Firebase 認證和角色管理系統
 */
export function usePermissions() {
  const { 
    userId, 
    userRoleAssignment, 
    isLoading: authLoading, 
    error: authError,
    checkPermission: authCheckPermission,
    hasPermission: authHasPermission
  } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 檢查單個權限
  const checkPermission = useCallback(async (
    permission: Permission,
    spaceId?: string
  ): Promise<PermissionCheckResult> => {
    setLoading(true);
    setError(null);

    try {
      // 如果沒有用戶 ID，返回未認證
      if (!userId) {
        return {
          hasPermission: false,
          reason: 'not_authenticated',
          source: spaceId ? 'space' : 'organization',
          roleId: undefined,
        };
      }

      // 如果沒有角色分配，返回未分配
      if (!userRoleAssignment) {
        return {
          hasPermission: false,
          reason: 'not_assigned',
          source: spaceId ? 'space' : 'organization',
          roleId: undefined,
        };
      }

      // 使用 auth provider 的權限檢查
      if (spaceId) {
        return await authCheckPermission(permission, spaceId);
      }

      // 組織層級權限檢查
      return await checkOrganizationPermissionInternal(permission, userRoleAssignment);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '權限檢查失敗';
      setError(errorMessage);
      
      return {
        hasPermission: false,
        reason: 'error',
        source: spaceId ? 'space' : 'organization',
        roleId: undefined,
      };
    } finally {
      setLoading(false);
    }
  }, [userId, userRoleAssignment, authCheckPermission, checkOrganizationPermissionInternal]);
  // TODO: [P1][hooks-deps][低認知]: 將 checkOrganizationPermissionInternal 納入依賴陣列
  // 問題：React Hook useCallback 缺少依賴項 'checkOrganizationPermissionInternal'
  // 影響：可能導致過時閉包問題
  // 建議：添加缺失的依賴項或移除依賴數組
  // @assignee frontend-team
  // @deadline 2025-01-15

  // 內部組織權限檢查函數
  const checkOrganizationPermissionInternal = useCallback(async (
    permission: Permission,
    roleAssignment: UserRoleAssignment
  ): Promise<PermissionCheckResult> => {
    try {
      // 檢查組織角色
      for (const orgRole of roleAssignment.organizationRoles) {
        const roleDef = roleManagementService.getRoleDefinition(orgRole.roleId);
        if (roleDef && roleDef.permissions.includes(permission)) {
          return {
            hasPermission: true,
            reason: 'granted',
            source: 'organization',
            roleId: orgRole.roleId,
          };
        }
      }

      return {
        hasPermission: false,
        reason: 'denied',
        source: 'organization',
        roleId: undefined,
      };
    } catch (error) {
      console.error('Organization permission check failed:', error);
      return {
        hasPermission: false,
        reason: 'error',
        source: 'organization',
        roleId: undefined,
      };
    }
  }, []);

  // 檢查多個權限
  const checkPermissions = useCallback(async (
    permissions: Permission[]
  ): Promise<Record<Permission, PermissionCheckResult>> => {
    const results: Record<Permission, PermissionCheckResult> = {} as Record<Permission, PermissionCheckResult>;
    
    for (const permission of permissions) {
      results[permission] = await checkPermission(permission);
    }
    
    return results;
  }, [checkPermission]);

  // 檢查用戶是否有特定權限（同步版本）
  const hasPermission = useCallback((
    permission: Permission,
    spaceId?: string
  ): boolean => {
    if (!userId || !userRoleAssignment) {
      return false;
    }

    // 使用 auth provider 的同步權限檢查
    if (spaceId) {
      return authHasPermission(permission, spaceId);
    }

    // 組織層級同步權限檢查
    for (const orgRole of userRoleAssignment.organizationRoles) {
      const roleDef = roleManagementService.getRoleDefinition(orgRole.roleId);
      if (roleDef && roleDef.permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  }, [userId, userRoleAssignment, authHasPermission]);

  // 檢查用戶是否有任一權限
  const hasAnyPermission = useCallback((
    permissions: Permission[],
    spaceId?: string
  ): boolean => {
    if (!userId || !userRoleAssignment) {
      return false;
    }
    
    return permissions.some(permission => hasPermission(permission, spaceId));
  }, [userId, userRoleAssignment, hasPermission]);

  // 檢查用戶是否有所有權限
  const hasAllPermissions = useCallback((
    permissions: Permission[],
    spaceId?: string
  ): boolean => {
    if (!userId || !userRoleAssignment) {
      return false;
    }
    
    return permissions.every(permission => hasPermission(permission, spaceId));
  }, [userId, userRoleAssignment, hasPermission]);

  // 獲取用戶缺少的權限
  const getMissingPermissions = useCallback((
    requiredPermissions: Permission[],
    spaceId?: string
  ): Permission[] => {
    if (!userId || !userRoleAssignment) {
      return requiredPermissions;
    }
    
    return requiredPermissions.filter(
      permission => !hasPermission(permission, spaceId)
    );
  }, [userId, userRoleAssignment, hasPermission]);

  // 檢查空間權限
  const checkSpacePermission = useCallback(async (
    spaceId: string,
    permission: Permission
  ): Promise<PermissionCheckResult> => {
    return checkPermission(permission, spaceId);
  }, [checkPermission]);

  // 檢查組織權限
  const checkOrganizationPermission = useCallback(async (
    organizationId: string,
    permission: Permission
  ): Promise<PermissionCheckResult> => {
    if (!userId || !userRoleAssignment) {
      return {
        hasPermission: false,
        reason: 'not_authenticated',
        source: 'organization',
        roleId: undefined,
      };
    }

    // 檢查用戶是否在指定組織中有角色
    const orgRole = userRoleAssignment.organizationRoles.find(
      role => role.organizationId === organizationId
    );

    if (!orgRole) {
      return {
        hasPermission: false,
        reason: 'not_assigned',
        source: 'organization',
        roleId: undefined,
      };
    }

    return await checkOrganizationPermissionInternal(permission, userRoleAssignment);
  }, [userId, userRoleAssignment, checkOrganizationPermissionInternal]);

  // 批量檢查空間權限
  const checkSpacePermissions = useCallback(async (
    spaceId: string,
    permissions: Permission[]
  ): Promise<Record<Permission, PermissionCheckResult>> => {
    const results: Record<Permission, PermissionCheckResult> = {} as Record<Permission, PermissionCheckResult>;
    
    for (const permission of permissions) {
      results[permission] = await checkSpacePermission(spaceId, permission);
    }
    
    return results;
  }, [checkSpacePermission]);

  // 清除錯誤
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 獲取用戶當前權限列表（用於 UI 顯示）
  const getUserPermissions = useCallback((spaceId?: string): Permission[] => {
    if (!userId || !userRoleAssignment) {
      return [];
    }

    const permissions: Permission[] = [];

    if (spaceId) {
      // 空間權限
      const spaceRole = userRoleAssignment.spaceRoles[spaceId];
      if (spaceRole) {
        const roleDef = roleManagementService.getRoleDefinition(spaceRole.roleId);
        if (roleDef) {
          permissions.push(...roleDef.permissions);
        }
      }
    } else {
      // 組織權限
      for (const orgRole of userRoleAssignment.organizationRoles) {
        const roleDef = roleManagementService.getRoleDefinition(orgRole.roleId);
        if (roleDef) {
          permissions.push(...roleDef.permissions);
        }
      }
    }

    return [...new Set(permissions)]; // 去重
  }, [userId, userRoleAssignment]);

  // 檢查用戶是否為管理員
  const isAdmin = useCallback((spaceId?: string): boolean => {
    return hasPermission({ id: 'admin', name: 'Administrator' }, spaceId);
  }, [hasPermission]);

  // 檢查用戶是否為空間管理員
  const isSpaceAdmin = useCallback((spaceId: string): boolean => {
    return hasPermission({ id: 'space_admin', name: 'Space Administrator' }, spaceId);
  }, [hasPermission]);

  // 檢查用戶是否為組織管理員
  const isOrganizationAdmin = useCallback((_organizationId: string): boolean => {
    return hasPermission({ id: 'org_admin', name: 'Organization Administrator' }, undefined);
  }, [hasPermission]);

  // 權限狀態摘要
  const permissionSummary = useMemo(() => {
    if (!userId || !userRoleAssignment) {
      return {
        isAuthenticated: false,
        hasRoles: false,
        spaceRoles: 0,
        organizationRoles: 0,
        totalPermissions: 0,
      };
    }

    const spaceRoles = Object.keys(userRoleAssignment.spaceRoles).length;
    const organizationRoles = userRoleAssignment.organizationRoles.length;
    const allPermissions = getUserPermissions();

    return {
      isAuthenticated: true,
      hasRoles: spaceRoles > 0 || organizationRoles > 0,
      spaceRoles,
      organizationRoles,
      totalPermissions: allPermissions.length,
    };
  }, [userId, userRoleAssignment, getUserPermissions]);

  return {
    // 狀態
    loading: loading || authLoading,
    error: error || authError,
    
    // 權限檢查方法
    checkPermission,
    checkPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getMissingPermissions,
    
    // 空間權限檢查
    checkSpacePermission,
    checkSpacePermissions,
    
    // 組織權限檢查
    checkOrganizationPermission,
    
    // 用戶權限信息
    getUserPermissions,
    isAdmin,
    isSpaceAdmin,
    isOrganizationAdmin,
    permissionSummary,
    
    // 工具方法
    clearError,
  };
}

export default usePermissions;