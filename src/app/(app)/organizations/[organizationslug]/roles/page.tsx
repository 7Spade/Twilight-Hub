'use client';
// TODO: [P2] CLEANUP unused import (L3) [低認知]
// - 問題：useCollection 未使用
// - 指引：移除未使用匯入或以前綴 _ 命名表示暫未用。

import { useFirestore } from '@/firebase';

// TODO: [P2] REFACTOR src/app/(app)/organizations/[organizationslug]/roles/page.tsx:3 - 清理未使用的導入
// 問題：'useCollection' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { RoleList } from '@/components/features/organizations/components/roles';
import { Skeleton } from '@/components/ui/skeleton';
import { type Account } from '@/lib/types-unified';
import { useUser } from '@/firebase';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function OrganizationRolesPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const { user } = useUser();
  const firestore = useFirestore();
  const [org, setOrg] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      if (!firestore || !params.organizationslug) return;
      setIsLoading(true);
      const orgsRef = collection(firestore, 'accounts');
      const q = query(orgsRef, where('slug', '==', params.organizationslug), where('type', '==', 'organization'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orgDoc = querySnapshot.docs[0];
        setOrg({ id: orgDoc.id, ...orgDoc.data() } as Account);
      } else {
        setOrg(null);
      }
      setIsLoading(false);
    };

    fetchOrg();
  }, [firestore, params.organizationslug]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-5 w-1/2" />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-10 w-80" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96 lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">組織不存在</h3>
        <p className="text-sm text-muted-foreground">
          您尋找的組織不存在或已被移除。
        </p>
      </div>
    );
  }

  // Check if user is organization admin/owner
  const isOwner = user?.uid === org.ownerId;
  const isAdmin = org.adminIds?.includes(user?.uid || '') || isOwner;

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/organizations">Organizations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/organizations/${org.slug}`}>{org.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Roles</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <RoleList 
        organizationId={org.id} 
        canManage={isAdmin}
      />
    </div>
  );
}
