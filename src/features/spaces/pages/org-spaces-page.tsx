'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  documentId,
} from 'firebase/firestore';

import { useFirestore, useUser, useCollection } from '@/firebase';
import { useDialogStore } from '@/hooks/use-dialog-store';
import { PageContainer } from '@/components/layout/page-container';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { SpacesView } from '@/features/spaces/components/spaces-view';
import { type Account, type Space } from '@/lib/types';

export function OrgSpacesPage({
  params,
}: {
  params: { organizationslug: string };
}) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { open: openDialog } = useDialogStore();
  const [org, setOrg] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      if (!firestore || !params.organizationslug) return;
      setIsLoading(true);
      const orgsRef = collection(firestore, 'accounts');
      const q = query(
        orgsRef,
        where('slug', '==', params.organizationslug),
        where('type', '==', 'organization'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orgDoc = querySnapshot.docs[0];
        setOrg({ id: orgDoc.id, ...orgDoc.data() } as Account);
      } else {
        setOrg(null);
      }
      setIsLoading(false);
    };

    fetchOrg();
  }, [firestore, params.organizationslug]);

  const spacesQuery = useMemo(
    () =>
      firestore && org
        ? query(collection(firestore, 'spaces'), where('ownerId', '==', org.id))
        : null,
    [firestore, org]
  );
  const { data: spacesData, isLoading: spacesLoading } =
    useCollection<Space>(spacesQuery);
  const spaces = spacesData || [];

  const yourSpacesQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'spaces'),
      where('ownerId', '==', user.uid)
    );
  }, [firestore, user]);

  const { data: yourSpacesData, isLoading: yourSpacesLoading } =
    useCollection<Space>(yourSpacesQuery);
  const yourSpaces = yourSpacesData || [];

  const starredSpacesQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'spaces'),
      where('starredByUserIds', 'array-contains', user.uid)
    );
  }, [firestore, user]);
  const { data: starredSpacesData, isLoading: starredSpacesLoading } =
    useCollection<Space>(starredSpacesQuery);
  const starredSpaces = starredSpacesData || [];

  const publicSpacesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'spaces'), where('isPublic', '==', true));
  }, [firestore]);
  const { data: publicSpacesData, isLoading: publicSpacesLoading } =
    useCollection<Space>(publicSpacesQuery);
  const publicSpaces = publicSpacesData || [];

  const ownersMap = useMemo(() => {
    const map = new Map<string, Account>();
    if (org) {
      map.set(org.id, org);
    }
    // In a real app, you'd fetch all relevant owners. For now, just the org is fine.
    return map;
  }, [org]);

  const pageIsLoading =
    isLoading ||
    spacesLoading ||
    yourSpacesLoading ||
    starredSpacesLoading ||
    publicSpacesLoading;

  if (isLoading) {
    return <div>Loading organization...</div>;
  }

  if (!org) {
    return <div>Organization not found</div>;
  }

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
              <Link href={`/organizations/${org.slug}`}>{org.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Spaces</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageContainer
        title="Spaces"
        description={`Create and manage spaces for the ${org.name} organization.`}
      >
        <div className="flex justify-end mb-8">
          <Button onClick={() => openDialog('createSpace')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Space
          </Button>
        </div>

        <SpacesView
          userId={user?.uid}
          owners={ownersMap}
          isLoading={pageIsLoading}
          yourSpaces={yourSpaces}
          starredSpaces={starredSpaces}
          publicSpaces={publicSpaces}
          organizationSpaces={spaces}
          showOrganizationSpacesTab={true}
          showYourSpacesTab={true}
          showStarredSpacesTab={true}
          showDiscoverTab={true}
        />
      </PageContainer>
    </div>
  );
}
