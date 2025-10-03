/**
 * @fileoverview 權限管理 React Hooks
 * 提供權限檢查和角色管理的 React 接口
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Permission, 
  UserRoleAssignment, 
  PermissionCheckResult,
  OrganizationRole,
  SpaceRole 
} from '@/lib/types-unified';
import { roleManagementService } from '@/lib/role-management';

/**
 * 權限檢查 Hook
 */
export function usePermissions(userId: string, spaceId: string) {
  const [userRoleAssignment, setUserRoleAssignment] = useState<UserRoleAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入用戶角色分配
  useEffect(() => {
    const loadUserRoles = async () => {
      try {
        setLoading(true);
        // TODO: 從數據庫載入用戶角色分配
        const roles = await fetchUserRoleAssignment(userId);
        setUserRoleAssignment(roles);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入角色失敗');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserRoles();
    }
  }, [userId]);

  // 檢查權限
  const checkPermission = useCallback(async (
    permission: Permission
  ): Promise<PermissionCheckResult> => {
    if (!userRoleAssignment) {
      return {
        hasPermission: false,
        reason: 'not_assigned',
        source: 'space',
        roleId: undefined
      };
    }

    return await roleManagementService.checkPermission(
      userId,
      spaceId,
      permission,
      userRoleAssignment
    );
  }, [userId, spaceId, userRoleAssignment]);

  // 檢查多個權限
  const checkPermissions = useCallback(async (
    permissions: Permission[]
  ): Promise<Record<Permission, PermissionCheckResult>> => {
    const results: Record<Permission, PermissionCheckResult> = {} as any;
    
    for (const permission of permissions) {
      results[permission] = await checkPermission(permission);
    }
    
    return results;
  }, [checkPermission]);

  // 獲取用戶在空間的有效權限
  const getSpacePermissions = useCallback(async (): Promise<Permission[]> => {
    if (!userRoleAssignment) {
      return [];
    }

    return await roleManagementService.getUserSpacePermissions(
      userId,
      spaceId,
      userRoleAssignment
    );
  }, [userId, spaceId, userRoleAssignment]);

  // 檢查是否有任何權限
  const hasAnyPermission = useCallback(async (
    permissions: Permission[]
  ): Promise<boolean> => {
    const results = await checkPermissions(permissions);
    return Object.values(results).some(result => result.hasPermission);
  }, [checkPermissions]);

  // 檢查是否有所有權限
  const hasAllPermissions = useCallback(async (
    permissions: Permission[]
  ): Promise<boolean> => {
    const results = await checkPermissions(permissions);
    return Object.values(results).every(result => result.hasPermission);
  }, [checkPermissions]);

  return {
    userRoleAssignment,
    loading,
    error,
    checkPermission,
    checkPermissions,
    getSpacePermissions,
    hasAnyPermission,
    hasAllPermissions
  };
}

/**
 * 角色管理 Hook
 */
export function useRoleManagement(userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 分配組織角色
  const assignOrganizationRole = useCallback(async (
    targetUserId: string,
    roleId: OrganizationRole,
    expiresAt?: Date
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const assignment = await roleManagementService.assignOrganizationRole(
        targetUserId,
        roleId,
        userId,
        expiresAt
      );
      
      // TODO: 更新數據庫
      return assignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : '分配角色失敗');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 分配空間角色
  const assignSpaceRole = useCallback(async (
    targetUserId: string,
    spaceId: string,
    roleId: SpaceRole,
    expiresAt?: Date
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const assignment = await roleManagementService.assignSpaceRole(
        targetUserId,
        spaceId,
        roleId,
        userId,
        expiresAt
      );
      
      // TODO: 更新數據庫
      return assignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : '分配角色失敗');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 移除空間角色
  const removeSpaceRole = useCallback(async (
    targetUserId: string,
    spaceId: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: 從數據庫移除角色
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '移除角色失敗');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    assignOrganizationRole,
    assignSpaceRole,
    removeSpaceRole
  };
}

/**
 * 權限保護組件 Hook
 */
export function usePermissionGuard(permission: Permission, userId: string, spaceId: string) {
  const { checkPermission, loading } = usePermissions(userId, spaceId);
  const [hasPermission, setHasPermission] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!loading) {
        setChecking(true);
        const result = await checkPermission(permission);
        setHasPermission(result.hasPermission);
        setChecking(false);
      }
    };

    check();
  }, [checkPermission, loading, permission]);

  return {
    hasPermission,
    checking: checking || loading
  };
}

// 模擬數據庫查詢函數
async function fetchUserRoleAssignment(userId: string): Promise<UserRoleAssignment> {
  // TODO: 實現真實的數據庫查詢
  return {
    userId,
    organizationRoles: [
      {
        roleId: 'organization_member',
        assignedAt: { toDate: () => new Date() } as any,
        assignedBy: 'system'
      }
    ],
    spaceRoles: {},
    effectivePermissions: []
  };
}

