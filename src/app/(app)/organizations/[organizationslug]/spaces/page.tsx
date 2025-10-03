'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirestore } from '@/firebase/provider';

type Account = { id: string; name?: string; slug?: string };
type Space = { id: string; name: string; description?: string; slug: string; ownerId: string };

export default function OrgSpacesPage() {
  const params = useParams();
  const orgSlug = (params?.organizationslug as string) || '';
  const db = useFirestore();

  const [org, setOrg] = useState<Account | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!db || !orgSlug) return;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        // find organization by slug
        const orgQ = query(
          collection(db, 'accounts'),
          where('type', '==', 'organization'),
          where('slug', '==', orgSlug),
          limit(1)
        );
        const orgSnap = await getDocs(orgQ as any);
        if (orgSnap.empty) {
          setOrg(null);
          setSpaces([]);
          setLoading(false);
          return;
        }
        const orgDoc = orgSnap.docs[0];
        const orgData = { id: orgDoc.id, ...(orgDoc.data() as any) } as Account;
        setOrg(orgData);

        // fetch spaces by ownerId
        const spacesQ = query(
          collection(db, 'spaces'),
          where('ownerId', '==', orgDoc.id)
        );
        const spacesSnap = await getDocs(spacesQ as any);
        setSpaces(spacesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Space[]);
      } catch (e: any) {
        setError(e?.message || 'Failed to load organization spaces');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [db, orgSlug]);

  const filtered = useMemo(() => {
    if (!search.trim()) return spaces;
    const q = search.toLowerCase();
    return spaces.filter((s) => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
  }, [spaces, search]);

  return (
    <PageContainer title={org ? `${org.name} · Spaces` : 'Organization Spaces'} description={org?.slug || orgSlug}>
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <Input
          placeholder="Search spaces..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-sm"
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No spaces found.</p>
      )}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((space) => (
            <Card key={space.id} className="group">
              <CardHeader>
                <CardTitle className="truncate">{space.name}</CardTitle>
                {space.description && (
                  <CardDescription className="line-clamp-2">{space.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent />
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/organizations/${orgSlug}/${space.slug}`}>Enter Space</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

/**
 * 組織空間頁面（最小可用）
 * 真實數據：根據 organizationslug 查 Org，再用 ownerId 查 spaces
 * 路由：/organizations/[organizationslug]/spaces
 * 組件類型：Client Component
 */