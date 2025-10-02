'use client';

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
import React, { useEffect, useState, useMemo } from 'react';
import { SpaceDetailView } from '@/features/spaces/components/space-detail-view';

export default function UserSpaceDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ userslug: string; spaceslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const { user: authUser } = useUser();
  const firestore = useFirestore();

  const [space, setSpace] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaceAndOwner = async () => {
      if (!firestore || !params.userslug || !params.spaceslug) return;
      setLoading(true);

      // Fetch owner (user)
      const accountsRef = collection(firestore, 'accounts');
      const ownerQuery = query(
        accountsRef,
        where('slug', '==', params.userslug),
        where('type', '==', 'user'),
        limit(1)
      );
      const ownerSnapshot = await getDocs(ownerQuery);
      let currentOwner = null;
      if (!ownerSnapshot.empty) {
        currentOwner = {
          id: ownerSnapshot.docs[0].id,
          ...ownerSnapshot.docs[0].data(),
        };
        setOwner(currentOwner);
      } else {
        setLoading(false);
        return;
      }

      // Fetch space owned by this user
      const spacesRef = collection(firestore, 'spaces');
      const spaceQuery = query(
        spacesRef,
        where('slug', '==', params.spaceslug),
        where('ownerId', '==', currentOwner.id),
        limit(1)
      );
      const spaceSnapshot = await getDocs(spaceQuery);

      if (!spaceSnapshot.empty) {
        const spaceDoc = spaceSnapshot.docs[0];
        setSpace({ id: spaceDoc.id, ...spaceDoc.data() });
      } else {
        setSpace(null);
      }
      setLoading(false);
    };
    fetchSpaceAndOwner();
  }, [firestore, params.userslug, params.spaceslug]);

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
      basePath={`/${params.userslug}/${params.spaceslug}`}
    />
  );
}
