/**
 * @fileoverview 權�?管�? React Hooks
 * ?��?權�?檢查?��??�管?��? React ?�口
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
 * 權�?檢查 Hook
 */
export function usePermissions(userId: string, spaceId: string) {
  const [userRoleAssignment, setUserRoleAssignment] = useState<UserRoleAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入?�戶角色?��?
  useEffect(() => {
    const loadUserRoles = async () => {
      try {
        setLoading(true);
        // TODO: 從數?�庫載入?�戶角色?��?
        const roles = await fetchUserRoleAssignment(userId);
        setUserRoleAssignment(roles);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入角色失�?');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserRoles();
    }
  }, [userId]);

  // 檢查權�?
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

  // 檢查多個�???  const checkPermissions = useCallback(async (
    permissions: Permission[]
  ): Promise<Record<Permission, PermissionCheckResult>> => {
    const results: Record<Permission, PermissionCheckResult> = {} as any;
    
    for (const permission of permissions) {
      results[permission] = await checkPermission(permission);
    }
    
    return results;
  }, [checkPermission]);

  // ?��??�戶?�空?��??��?權�?
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

  // 檢查?�否?�任何�???  const hasAnyPermission = useCallback(async (
    permissions: Permission[]
  ): Promise<boolean> => {
    const results = await checkPermissions(permissions);
    return Object.values(results).some(result => result.hasPermission);
  }, [checkPermissions]);

  // 檢查?�否?��??��???  const hasAllPermissions = useCallback(async (
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
 * 角色管�? Hook
 */
export function useRoleManagement(userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ?��?組�?角色
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
      
      // TODO: ?�新?��?�?      return assignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : '?��?角色失�?');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ?��?空�?角色
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
      
      // TODO: ?�新?��?�?      return assignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : '?��?角色失�?');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 移除空�?角色
  const removeSpaceRole = useCallback(async (
    targetUserId: string,
    spaceId: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: 從數?�庫移除角色
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '移除角色失�?');
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
 * 權�?保護組件 Hook
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

// 模擬?��?庫查詢函??async function fetchUserRoleAssignment(userId: string): Promise<UserRoleAssignment> {
  // TODO: 實現?�實?�數?�庫?�詢
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

