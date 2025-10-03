/**
 * @fileoverview 權限保護組件
 * 提供基於權限的條件渲染和訪問控制
 */

import React from 'react';
import { Permission } from '@/lib/types';
import { usePermissionGuard } from '@/hooks/use-permissions';

interface PermissionGuardProps {
  permission: Permission;
  userId: string;
  spaceId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

/**
 * 權限保護組件
 * 只有當用戶具有指定權限時才渲染子組件
 */
export function PermissionGuard({
  permission,
  userId,
  spaceId,
  children,
  fallback = null,
  loading = <div className="animate-pulse bg-muted h-4 w-20 rounded" />
}: PermissionGuardProps) {
  const { hasPermission, checking } = usePermissionGuard(permission, userId, spaceId);

  if (checking) {
    return <>{loading}</>;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface PermissionButtonProps extends PermissionGuardProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 權限保護按鈕
 * 只有當用戶具有指定權限時才啟用按鈕
 */
export function PermissionButton({
  permission,
  userId,
  spaceId,
  children,
  onClick,
  disabled = false,
  className = '',
  fallback = null
}: PermissionButtonProps) {
  const { hasPermission, checking } = usePermissionGuard(permission, userId, spaceId);

  if (checking) {
    return (
      <button disabled className={`opacity-50 cursor-not-allowed ${className}`}>
        {children}
      </button>
    );
  }

  if (!hasPermission) {
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

interface PermissionTabProps extends PermissionGuardProps {
  value: string;
}

/**
 * 權限保護標籤頁
 * 只有當用戶具有指定權限時才顯示標籤頁
 */
export function PermissionTab({
  permission,
  userId,
  spaceId,
  children,
  value,
  fallback = null
}: PermissionTabProps) {
  const { hasPermission, checking } = usePermissionGuard(permission, userId, spaceId);

  if (checking) {
    return null;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
