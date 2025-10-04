'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { useFirestore } from '@/firebase/provider';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

type Org = { id: string; name?: string };
type Role = { id: string; name?: string; description?: string };

export default function OrgRolesPage() {
  const params = useParams();
  const slug = (params?.organizationslug as string) || '';
  const db = useFirestore();

  const [org, setOrg] = useState<Org | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !slug) return;
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const orgQ = query(
          collection(db, 'accounts'),
          where('type', '==', 'organization'),
          where('slug', '==', slug),
          limit(1)
        );
        const orgSnap = await getDocs(orgQ);
        if (orgSnap.empty) {
          setOrg(null);
          setRoles([]);
          setLoading(false);
          return;
        }
        const orgDoc = orgSnap.docs[0];
        const nextOrg: Org = { id: orgDoc.id, ...(orgDoc.data() as any) };
        setOrg(nextOrg);

        const rolesCol = collection(db, 'accounts', nextOrg.id, 'roles');
        const rolesSnap = await getDocs(rolesCol);
        setRoles(rolesSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      } catch (e: any) {
        setError(e?.message || 'Failed to load roles');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [db, slug]);

  return (
    <PageContainer title="Roles" description={org?.name || slug}>
      {loading && <p>Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && roles.length === 0 && (
        <p className="text-sm text-muted-foreground">No roles defined.</p>
      )}
      {!loading && roles.length > 0 && (
        <ul className="space-y-2">
          {roles.map(r => (
            <li key={r.id} className="text-sm">
              <span className="font-medium">{r.name || r.id}</span>
              {r.description && (
                <span className="text-muted-foreground"> — {r.description}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
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