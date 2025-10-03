import { use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ organizationslug: string }>
}) {
  const { organizationslug } = await params;
  // Minimal server component: fetch via client helper not available; display slug.
  // For Occam, just render slug; list page already pulls data.
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Organization</h1>
      <p className="text-sm text-muted-foreground">{organizationslug}</p>
    </div>
  );
}

/**
 * 組織詳情頁面
 * 
 * 功能：
 * - 組織詳情顯示
 * - 組織概覽
 * - 組織統計
 * - 組織導航
 * 
 * 路由：/organizations/[organizationslug]
 * 組件類型：Client Component
 */