'use client';

import React, { useEffect, useState } from 'react';
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
import { SpaceDetailView } from '@/features/spaces/components/space-detail-view';
import { type Account, type Space } from '@/lib/types';

export function SpaceDetailsPage({
  params,
}: {
  params: { organizationslug?: string; userslug?: string; spaceslug: string };
}) {
  const { user: authUser } = useUser();
  const firestore = useFirestore();

  const [space, setSpace] = useState<Space | null>(null);
  const [owner, setOwner] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaceAndOwner = async () => {
      if (!firestore) return;
      setLoading(true);

      const ownerSlug = params.organizationslug || params.userslug;
      if (!ownerSlug || !params.spaceslug) {
        setLoading(false);
        return;
      }
      
      const ownerType = params.organizationslug ? 'organization' : 'user';

      const accountsRef = collection(firestore, 'accounts');
      const ownerQuery = query(
        accountsRef,
        where('slug', '==', ownerSlug),
        where('type', '==', ownerType),
        limit(1)
      );
      const ownerSnapshot = await getDocs(ownerQuery);
      let currentOwner: Account | null = null;
      if (!ownerSnapshot.empty) {
        currentOwner = {
          id: ownerSnapshot.docs[0].id,
          ...ownerSnapshot.docs[0].data(),
        } as Account;
        setOwner(currentOwner);
      } else {
        setLoading(false);
        return;
      }

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
        setSpace({ id: spaceDoc.id, ...spaceDoc.data() } as Space);
      } else {
        setSpace(null);
      }
      setLoading(false);
    };
    fetchSpaceAndOwner();
  }, [firestore, params.spaceslug, params.organizationslug, params.userslug]);

  const breadcrumbs = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {owner?.type === 'organization' ? (
          <>
             <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/organizations">Organizations</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
             <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href={`/organizations/${owner.slug}`}>{owner.name}</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : (
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href={`/${owner?.slug}`}>{owner?.name || "..."}</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
        )}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={owner?.type === 'organization' ? `/organizations/${owner.slug}/spaces`: `/spaces`}>
              Spaces
            </Link>
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
