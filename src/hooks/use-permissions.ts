/**
 * @fileoverview æ¬Šé?ç®¡ç? React Hooks
 * ?ä?æ¬Šé?æª¢æŸ¥?Œè??²ç®¡?†ç? React ?¥å£
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
 * æ¬Šé?æª¢æŸ¥ Hook
 */
export function usePermissions(userId: string, spaceId: string) {
  const [userRoleAssignment, setUserRoleAssignment] = useState<UserRoleAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // è¼‰å…¥?¨æˆ¶è§’è‰²?†é?
  useEffect(() => {
    const loadUserRoles = async () => {
      try {
        setLoading(true);
        // TODO: å¾æ•¸?šåº«è¼‰å…¥?¨æˆ¶è§’è‰²?†é?
        const roles = await fetchUserRoleAssignment(userId);
        setUserRoleAssignment(roles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'è¼‰å…¥è§’è‰²å¤±æ?');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserRoles();
    }
  }, [userId]);

  // æª¢æŸ¥æ¬Šé?
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

  // æª¢æŸ¥å¤šå€‹æ???  const checkPermissions = useCallback(async (
    permissions: Permission[]
  ): Promise<Record<Permission, PermissionCheckResult>> => {
    const results: Record<Permission, PermissionCheckResult> = {} as any;
    
    for (const permission of permissions) {
      results[permission] = await checkPermission(permission);
    }
    
    return results;
  }, [checkPermission]);

  // ?²å??¨æˆ¶?¨ç©º?“ç??‰æ?æ¬Šé?
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

  // æª¢æŸ¥?¯å¦?‰ä»»ä½•æ???  const hasAnyPermission = useCallback(async (
    permissions: Permission[]
  ): Promise<boolean> => {
    const results = await checkPermissions(permissions);
    return Object.values(results).some(result => result.hasPermission);
  }, [checkPermissions]);

  // æª¢æŸ¥?¯å¦?‰æ??‰æ???  const hasAllPermissions = useCallback(async (
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
 * è§’è‰²ç®¡ç? Hook
 */
export function useRoleManagement(userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ?†é?çµ„ç?è§’è‰²
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
      
      // TODO: ?´æ–°?¸æ?åº?      return assignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : '?†é?è§’è‰²å¤±æ?');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ?†é?ç©ºé?è§’è‰²
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
      
      // TODO: ?´æ–°?¸æ?åº?      return assignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : '?†é?è§’è‰²å¤±æ?');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ç§»é™¤ç©ºé?è§’è‰²
  const removeSpaceRole = useCallback(async (
    targetUserId: string,
    spaceId: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: å¾æ•¸?šåº«ç§»é™¤è§’è‰²
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ç§»é™¤è§’è‰²å¤±æ?');
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
 * æ¬Šé?ä¿è­·çµ„ä»¶ Hook
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

// æ¨¡æ“¬?¸æ?åº«æŸ¥è©¢å‡½??async function fetchUserRoleAssignment(userId: string): Promise<UserRoleAssignment> {
  // TODO: å¯¦ç¾?Ÿå¯¦?„æ•¸?šåº«?¥è©¢
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

