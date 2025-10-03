'use client';

import React, { ReactNode } from 'react';
import { Permission } from '@/lib/types-unified';
import { useAuth } from './auth-provider';

interface PermissionGuardProps {
  permission: Permission;
  spaceId: string;
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
  requireAll?: boolean; // If true, requires all permissions
  permissions?: Permission[]; // Multiple permissions support
}

export function PermissionGuard({ 
  permission,
  permissions = [],
  spaceId, 
  children, 
  fallback = null,
  loading = <div className="animate-pulse bg-muted h-4 w-20 rounded" />,
  requireAll = false
}: PermissionGuardProps) {
  const { hasPermission, isLoading, isAuthenticated } = useAuth();

  // Show loading state
  if (isLoading) {
    return <>{loading}</>;
  }

  // If not authenticated, show fallback
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check single permission
  if (permission && !permissions.length) {
    if (!hasPermission(permission, spaceId)) {
      return <>{fallback}</>;
    }
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasAllPermissions = permissions.every(p => hasPermission(p, spaceId));
    const hasAnyPermission = permissions.some(p => hasPermission(p, spaceId));
    
    if (requireAll && !hasAllPermissions) {
      return <>{fallback}</>;
    }
    
    if (!requireAll && !hasAnyPermission) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

// Higher-order component for permission-based rendering
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  permission: Permission,
  spaceId: string,
  fallback?: ReactNode
) {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGuard permission={permission} spaceId={spaceId} fallback={fallback}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
}

// Hook for permission checking
export function usePermissionCheck(permission: Permission, spaceId: string) {
  const { hasPermission, isLoading, isAuthenticated } = useAuth();
  
  return {
    hasPermission: hasPermission(permission, spaceId),
    isLoading,
    isAuthenticated,
    canAccess: isAuthenticated && !isLoading && hasPermission(permission, spaceId)
  };
}