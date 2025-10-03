'use client';

import { useState, useCallback } from 'react';
import { Permission, PermissionCheckResult } from '@/lib/types-unified';

/**
 * 權限檢查 Hook
 * 提供用戶權限檢查功能
 */
export function usePermissions() {
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
      // TODO: 實現實際的權限檢查邏輯
      // 這裡應該調用 Firebase 或 API 來檢查權限
      
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 暫時返回默認結果
      return {
        hasPermission: false,
        reason: 'not_implemented',
        source: spaceId ? 'space' : 'organization',
        roleId: undefined,
      };
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
  }, []);

  // TODO: [P1] [BUG] [AUTH] [TODO] 修復 TypeScript 解析錯誤 - 字串編碼問題導致語法錯誤
  // 檢查多個權限
  const checkPermissions = useCallback(async (
    permissions: Permission[]
  ): Promise<Record<Permission, PermissionCheckResult>> => {
    const results: Record<Permission, PermissionCheckResult> = {} as unknown; /* TODO: [P2] [BUG] [UI] [TODO] 修復 TypeScript any 類型警告 */
    
    for (const permission of permissions) {
      results[permission] = await checkPermission(permission);
    }
    
    return results;
  }, [checkPermission]);

  // 檢查用戶是否有特定權限（同步版本）
  const hasPermission = useCallback((
    permission: Permission,
    userPermissions?: Permission[]
  ): boolean => {
    if (!userPermissions) {
      return false;
    }
    
    return userPermissions.includes(permission);
  }, []);

  // 檢查用戶是否有任一權限
  const hasAnyPermission = useCallback((
    permissions: Permission[],
    userPermissions?: Permission[]
  ): boolean => {
    if (!userPermissions) {
      return false;
    }
    
    return permissions.some(permission => userPermissions.includes(permission));
  }, []);

  // 檢查用戶是否有所有權限
  const hasAllPermissions = useCallback((
    permissions: Permission[],
    userPermissions?: Permission[]
  ): boolean => {
    if (!userPermissions) {
      return false;
    }
    
    return permissions.every(permission => userPermissions.includes(permission));
  }, []);

  // 獲取用戶缺少的權限
  const getMissingPermissions = useCallback((
    requiredPermissions: Permission[],
    userPermissions?: Permission[]
  ): Permission[] => {
    if (!userPermissions) {
      return requiredPermissions;
    }
    
    return requiredPermissions.filter(
      permission => !userPermissions.includes(permission)
    );
  }, []);

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
    // TODO: 實現組織權限檢查
    return checkPermission(permission);
  }, [checkPermission]);

  // 批量檢查空間權限
  const checkSpacePermissions = useCallback(async (
    spaceId: string,
    permissions: Permission[]
  ): Promise<Record<Permission, PermissionCheckResult>> => {
    const results: Record<Permission, PermissionCheckResult> = {} as unknown; /* TODO: [P2] [BUG] [UI] [TODO] 修復 TypeScript any 類型警告 */
    
    for (const permission of permissions) {
      results[permission] = await checkSpacePermission(spaceId, permission);
    }
    
    return results;
  }, [checkSpacePermission]);

  // 清除錯誤
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 狀態
    loading,
    error,
    
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
    
    // 工具方法
    clearError,
  };
}

export default usePermissions;