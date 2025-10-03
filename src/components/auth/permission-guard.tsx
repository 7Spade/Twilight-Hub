/**
 * @fileoverview 權�?保護組件
 * ?��??�於權�??��?件渲?��?訪�??�制
 */

import React from 'react';
import { Permission } from '@/lib/types-unified';
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
 * 權�?保護組件
 * ?��??�用?�具?��?定�??��??�渲?��?組件
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
 * 權�?保護?��?
 * ?��??�用?�具?��?定�??��??��??��??? */
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
 * 權�?保護標籤?? * ?��??�用?�具?��?定�??��??�顯示�?籤�?
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

