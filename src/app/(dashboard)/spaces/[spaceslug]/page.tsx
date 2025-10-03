'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { SpaceDetailView } from '@/components/features/spaces/components/spaces-detail-view';
import { type Account, type Space } from '@/lib/types-unified';

export default function UnifiedSpaceDetailsPage({
  params,
}: {
  params: Promise<{ spaceslug: string }>;
}) {
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const { spaceslug } = use(params);

  const [space, setSpace] = useState<Space | null>(null);
  const [owner, setOwner] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaceAndOwner = async () => {
      if (!firestore || !spaceslug) return;
      setLoading(true);

      // Find space by slug
      const spacesRef = collection(firestore, 'spaces');
      const spaceQuery = query(
        spacesRef,
        where('slug', '==', spaceslug),
        limit(1)
      );
      const spaceSnapshot = await getDocs(spaceQuery);

      if (spaceSnapshot.empty) {
        setSpace(null);
        setLoading(false);
        return;
      }

      const spaceDoc = spaceSnapshot.docs[0];
      const spaceData = { id: spaceDoc.id, ...spaceDoc.data() } as Space;
      setSpace(spaceData);

      // Find owner by ownerId
      const accountsRef = collection(firestore, 'accounts');
      const ownerQuery = query(
        accountsRef,
        where('__name__', '==', spaceData.ownerId),
        limit(1)
      );
      const ownerSnapshot = await getDocs(ownerQuery);

      if (!ownerSnapshot.empty) {
        const ownerDoc = ownerSnapshot.docs[0];
        const ownerData = {
          id: ownerDoc.id,
          ...ownerDoc.data(),
        } as Account;
        setOwner(ownerData);
      } else {
        setOwner(null);
      }
      setLoading(false);
    };
    fetchSpaceAndOwner();
  }, [firestore, spaceslug]);

  const breadcrumbs = (
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
            <Link href="/spaces">Spaces</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{space?.name || '...'}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <SpaceDetailView
      isLoading={loading}
      space={space}
      owner={owner}
      authUser={authUser}
      breadcrumbs={breadcrumbs}
    />
  );
}
