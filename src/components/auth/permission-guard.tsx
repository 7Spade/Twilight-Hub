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
  // TODO: [P1] FEAT src/components/auth/permission-guard.tsx - 實現權限檢查邏輯
  // 需要根據用戶權限決定是否顯示子組件
  // @assignee dev
  return <>{children}</>;
}