"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

type Account = { id: string; name?: string; slug?: string };
type Item = { id: string; name: string; sku?: string; category?: string };

export default function OrgInventoryPage() {
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

  const itemsQuery = useMemo(
    () => (db && org ? collection(db, 'accounts', org.id, 'items') : null),
    [db, org]
  );
  const { data: items, loading: itemsLoading, error: itemsError } = useCollection<Item>(itemsQuery as any);

  if (loading) return <div>Loading organization...</div>;
  if (!org) return <div>Organization not found</div>;

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
              <Link href={`/organizations/${org.slug}`}>{org.name || org.id}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inventory</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageContainer title="Inventory" description={`Items for ${org.name || org.id}`}>
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            {(itemsLoading || !items) && <p>Loading items...</p>}
            {itemsError && <p className="text-sm text-red-600">{itemsError.message}</p>}
            {!itemsLoading && items && items.length === 0 && (
              <p className="text-sm text-muted-foreground">No items yet.</p>
            )}
            {!itemsLoading && items && items.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it: Item) => (
                    <TableRow key={it.id}>
                      <TableCell className="font-medium">{it.name}</TableCell>
                      <TableCell>{it.sku}</TableCell>
                      <TableCell>{it.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}