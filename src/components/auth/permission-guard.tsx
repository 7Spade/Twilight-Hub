/**
 * @fileoverview æ¬Šé?ä¿è­·çµ„ä»¶
 * ?ä??ºæ–¼æ¬Šé??„æ?ä»¶æ¸²?“å?è¨ªå??§åˆ¶
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
 * æ¬Šé?ä¿è­·çµ„ä»¶
 * ?ªæ??¶ç”¨?¶å…·?‰æ?å®šæ??æ??æ¸²?“å?çµ„ä»¶
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
 * æ¬Šé?ä¿è­·?‰é?
 * ?ªæ??¶ç”¨?¶å…·?‰æ?å®šæ??æ??å??¨æ??? */
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
 * æ¬Šé?ä¿è­·æ¨™ç±¤?? * ?ªæ??¶ç”¨?¶å…·?‰æ?å®šæ??æ??é¡¯ç¤ºæ?ç±¤é?
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

