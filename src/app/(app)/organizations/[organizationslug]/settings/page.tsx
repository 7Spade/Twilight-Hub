'use client';

import { useParams } from 'next/navigation';

export default function OrgSettingsPage() {
  const params = useParams();
  const slug = (params?.organizationslug as string) || '';
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Organization Settings</h1>
      <p className="text-sm text-muted-foreground">Organization: {slug}</p>
    </div>
  );
}

/**
 * 組織設定頁面
 * 
 * 功能：
 * - 組織基本設定
 * - 組織信息編輯
 * - 組織偏好設定
 * - 組織安全設定
 * 
 * 路由：/organizations/[organizationslug]/settings
 * 組件類型：Client Component
 */