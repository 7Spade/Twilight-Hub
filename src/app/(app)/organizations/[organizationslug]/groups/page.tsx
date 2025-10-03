"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { PageContainer } from '@/components/layout/page-container';

type Account = { id: string; name?: string; slug?: string };
type Group = { id: string; name?: string; memberIds?: string[] };

export default function OrgGroupsPage() {
  const params = useParams();
  const slug = (params?.organizationslug as string) || '';
  const db = useFirestore();

  const [org, setOrg] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !slug) return;
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const q = query(
          collection(db, 'accounts'),
          where('type', '==', 'organization'),
          where('slug', '==', slug),
          limit(1)
        );
        const snap = await getDocs(q);
        setOrg(!snap.empty ? ({ id: snap.docs[0].id, ...(snap.docs[0].data() as any) } as Account) : null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load organization');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [db, slug]);

  const groupsQuery = useMemo(
    () => (db && org ? collection(db, 'accounts', org.id, 'groups') : null),
    [db, org]
  );
  const { data: groups, loading: groupsLoading, error: groupsError } = useCollection<Group>(groupsQuery as any);

  return (
    <PageContainer title="Groups" description={org ? org.name : slug}>
      {(loading || groupsLoading) && <p>Loading...</p>}
      {(error || groupsError) && <p className="text-sm text-red-600">{error || groupsError?.message}</p>}
      {!loading && !groupsLoading && (groups?.length || 0) === 0 && (
        <p className="text-sm text-muted-foreground">No groups yet.</p>
      )}
      {!loading && !groupsLoading && (groups?.length || 0) > 0 && (
        <ul className="list-disc pl-5">
          {groups!.map((g) => (
            <li key={g.id} className="text-sm">{g.name || g.id}</li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}