'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { collection, type FirestoreDataConverter } from 'firebase/firestore';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useUser } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';

type Space = {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isPublic?: boolean;
  ownerId: string;
  starredByUserIds?: string[];
};

export default function SpacesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [search, setSearch] = useState('');

  const spacesRef = useMemo(() => {
    if (!firestore) return null;
    const converter: FirestoreDataConverter<Space> = {
      fromFirestore: (snap) => ({ id: snap.id, ...(snap.data() as any) }) as Space,
      toFirestore: (data) => {
        const { id, ...rest } = data as any;
        return rest;
      },
    };
    return collection(firestore, 'spaces').withConverter(converter);
  }, [firestore]);
  const { data: allSpaces, loading } = useCollection<Space>(spacesRef);

  const filtered = useMemo(() => {
    const list = allSpaces || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((s) =>
      s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
    );
  }, [allSpaces, search]);

  return (
    <PageContainer title="Spaces" description="Browse and enter collaborative spaces.">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <Input
          placeholder="Search spaces..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-sm"
        />
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/discover">Discover</Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading spaces...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No spaces found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((space) => (
            <Card key={space.id} className="group">
              <CardHeader>
                <CardTitle className="truncate">{space.name}</CardTitle>
                {space.description && (
                  <CardDescription className="line-clamp-2">{space.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {space.isPublic ? 'Public' : 'Private'}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/spaces/${space.slug}`}>Enter Space</Link>
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
 * 空間列表頁面（最小可用）
 * 
 * 真實數據：Firestore 'spaces' 集合
 * UI：使用 src/components/ui
 * 
 * 路由：/spaces
 * 組件類型：Client Component
 */