'use client';

import { Permission } from '@/lib/types-unified';

interface PermissionGuardProps {
  permission: Permission;
  spaceId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ 
  permission, 
  spaceId, 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  // TODO: Implement permission checking logic
  return <>{children}</>;
}