'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { PageContainer } from '@/components/layout/page-container';

type Account = { id: string; name?: string; username?: string; bio?: string };

export default function UserProfilePage() {
  const params = useParams();
  const userslug = (params?.userslug as string) || '';
  const db = useFirestore();

  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userslug || !db) return;
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const q = query(
          collection(db, 'accounts'),
          where('type', '==', 'user'),
          where('slug', '==', userslug),
          limit(1)
        );
        const snap = await getDocs(q);
        setUser(snap.empty ? null : ({ id: snap.docs[0].id, ...(snap.docs[0].data() as any) }));
      } catch (e: any) {
        setError(e?.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [db, userslug]);

  return (
    <PageContainer title="User Profile" description={userslug ? `@${userslug}` : ''}>
      {loading && <p>Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && user && (
        <div className="space-y-1">
          <p className="text-sm">Name: {user.name || '-'}</p>
          <p className="text-sm">Username: {user.username || userslug}</p>
          <p className="text-sm text-muted-foreground">{user.bio || ''}</p>
        </div>
      )}
      {!loading && !user && <p className="text-sm text-muted-foreground">User not found.</p>}
    </PageContainer>
  );
}

/**
 * 用戶資料頁面
 * 
 * 功能：
 * - 用戶公開資料顯示
 * - 用戶空間列表
 * - 用戶活動概覽
 * - 追蹤功能
 * 
 * 路由：/[userslug]
 * 組件類型：Client Component
 */