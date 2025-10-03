'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase/provider';

type Space = {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isPublic?: boolean;
  ownerId: string;
};

export default function SpaceDetailsPage() {
  const params = useParams();
  const spaceslug = (params?.spaceslug as string) || '';
  const db = useFirestore();

  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !spaceslug) return;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const q = query(
          collection(db, 'spaces'),
          where('slug', '==', spaceslug),
          limit(1)
        );
        const snap = await getDocs(q as any);
        if (snap.empty) {
          setSpace(null);
        } else {
          const doc = snap.docs[0];
          setSpace({ id: doc.id, ...(doc.data() as any) });
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load space');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [db, spaceslug]);

  return (
    <PageContainer title={space?.name || 'Space'} description={space?.slug || spaceslug}>
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !space && (
        <p className="text-sm text-muted-foreground">Space not found.</p>
      )}
      {space && (
        <Card>
          <CardHeader>
            <CardTitle>{space.name}</CardTitle>
            {space.description && (
              <CardDescription>{space.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Visibility: {space.isPublic ? 'Public' : 'Private'}
            </div>
          </CardContent>
        </Card>
      )}
      <div className="pt-4">
        <Button asChild variant="outline">
          <Link href="/spaces">Back to Spaces</Link>
        </Button>
      </div>
    </PageContainer>
  );
}

/**
 * 空間詳情頁面（最小可用）
 * 真實數據：根據 slug 查詢 Firestore 'spaces'
 * 路由：/spaces/[spaceslug]
 * 組件類型：Client Component
 */