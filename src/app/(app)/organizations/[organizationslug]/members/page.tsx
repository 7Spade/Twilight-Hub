'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, doc, getDocs, limit, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { PageContainer } from '@/components/layout/page-container';

type Account = { id: string; name?: string; slug?: string; memberIds?: string[] };
type UserAccount = { id: string; name?: string; email?: string };

export default function OrgMembersPage() {
  const params = useParams();
  const slug = (params?.organizationslug as string) || '';
  const db = useFirestore();

  const [org, setOrg] = useState<Account | null>(null);
  const [members, setMembers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !slug) return;
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        // find org by slug
        const q = query(
          collection(db, 'accounts'),
          where('type', '==', 'organization'),
          where('slug', '==', slug),
          limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          setOrg(null);
          setMembers([]);
          setLoading(false);
          return;
        }
        const orgDoc = snap.docs[0];
        const orgData = { id: orgDoc.id, ...(orgDoc.data() as any) } as Account;
        setOrg(orgData);
        const memberIds = orgData.memberIds || [];
        if (memberIds.length === 0) {
          setMembers([]);
          setLoading(false);
          return;
        }
        // fetch member docs individually (Occam: simple loop; later optimize with batched queries if needed)
        const results: UserAccount[] = [];
        for (const uid of memberIds) {
          const userRef = doc(db, 'accounts', uid);
          const userSnap = await getDocs(query(collection(db, 'accounts'), where('__name__', '==', uid), where('type', '==', 'user'), limit(1)));
          if (!userSnap.empty) {
            const d = userSnap.docs[0];
            results.push({ id: d.id, ...(d.data() as any) });
          }
        }
        setMembers(results);
      } catch (e: any) {
        setError(e?.message || 'Failed to load members');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [db, slug]);

  return (
    <PageContainer title="Members" description={org ? org.name : slug}>
      {loading && <p>Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && members.length === 0 && (
        <p className="text-sm text-muted-foreground">No members found.</p>
      )}
      {!loading && members.length > 0 && (
        <ul className="list-disc pl-5">
          {members.map((m) => (
            <li key={m.id} className="text-sm">
              {m.name || m.email || m.id}
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}

/**
 * 成員管理頁面
 * 
 * 功能：
 * - 成員列表顯示
 * - 成員邀請
 * - 成員角色管理
 * - 成員權限設定
 * 
 * 路由：/organizations/[organizationslug]/members
 * 組件類型：Client Component
 */