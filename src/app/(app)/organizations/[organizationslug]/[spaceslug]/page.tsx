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
import {
  collection,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { SpaceDetailView } from '@/features/spaces/components/space-detail-view';
import { type Account, type Space } from '@/lib/types';

export default function OrgSpaceDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string; spaceslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const { user: authUser } = useUser();
  const firestore = useFirestore();

  const [space, setSpace] = useState<Space | null>(null);
  const [org, setOrg] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaceAndOrg = async () => {
      if (!firestore || !params.spaceslug || !params.organizationslug) return;
      setLoading(true);

      // Fetch organization
      const accountsRef = collection(firestore, 'accounts');
      const orgQuery = query(
        accountsRef,
        where('slug', '==', params.organizationslug),
        where('type', '==', 'organization'),
        limit(1)
      );
      const orgSnapshot = await getDocs(orgQuery);
      let currentOrg: Account | null = null;
      if (!orgSnapshot.empty) {
        currentOrg = {
          id: orgSnapshot.docs[0].id,
          ...orgSnapshot.docs[0].data(),
        } as Account;
        setOrg(currentOrg);
      } else {
        setLoading(false);
        return;
      }

      // Fetch space
      const spacesRef = collection(firestore, 'spaces');
      const spaceQuery = query(
        spacesRef,
        where('slug', '==', params.spaceslug),
        where('ownerId', '==', currentOrg.id),
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
    fetchSpaceAndOrg();
  }, [firestore, params.spaceslug, params.organizationslug]);

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
            <Link href="/organizations">Organizations</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/organizations/${org?.slug}`}>{org?.name || '...'}</Link>
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
      owner={org}
      authUser={authUser}
      breadcrumbs={breadcrumbs}
      basePath={`/organizations/${params.organizationslug}/${params.spaceslug}`}
    />
  );
}
