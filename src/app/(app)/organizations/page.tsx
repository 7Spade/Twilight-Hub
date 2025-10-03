'use client';

import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase/provider';

type Org = { id: string; name?: string };

export default function OrganizationsPage() {
  const db = useFirestore();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        const snap = await getDocs(collection(db, 'organizations'));
        setOrgs(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      } catch (e: any) {
        setError(e?.message || 'Failed to connect to Firestore');
      }
    };
    run();
  }, [db]);

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Organizations</h1>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <ul className="list-disc pl-5">
        {orgs.map((o) => (
          <li key={o.id}>{o.name || o.id}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 組織列表頁面
 * 
 * 功能：
 * - 組織列表顯示
 * - 組織搜尋和過濾
 * - 組織創建
 * - 組織管理
 * 
 * 路由：/organizations
 * 組件類型：Client Component
 */