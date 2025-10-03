"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

type Org = { id: string; name?: string; slug?: string };

export default function OrganizationPage() {
  const params = useParams();
  const slug = (params?.organizationslug as string) || '';
  const db = useFirestore();
  const [org, setOrg] = useState<Org | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        setError(null);
        const q = query(collection(db, 'organizations'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const d = snap.docs[0];
          setOrg({ id: d.id, ...(d.data() as any) });
        } else {
          setOrg(null);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load organization');
      }
    };
    load();
  }, [db, slug]);

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Organization</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {org ? (
        <div>
          <p className="text-sm text-muted-foreground">{org.name || org.slug || org.id}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{slug}</p>
      )}
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