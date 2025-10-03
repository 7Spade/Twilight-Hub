'use client';

import { useParams } from 'next/navigation';

export default function OrgRolesPage() {
  const params = useParams();
  const slug = (params?.organizationslug as string) || '';
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Roles</h1>
      <p className="text-sm text-muted-foreground">Organization: {slug}</p>
    </div>
  );
}

/**
 * 角色管理頁面
 * 
 * 功能：
 * - 角色列表顯示
 * - 角色創建和編輯
 * - 角色權限設定
 * - 角色分配管理
 * 
 * 路由：/organizations/[organizationslug]/roles
 * 組件類型：Client Component
 */