'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { doc, updateDoc, query, where, collection, getDocs, limit } from 'firebase/firestore';

import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SpaceSettingsView, type SpaceSettingsFormValues } from '@/features/spaces/components/space-settings-view';
import { type Account, type Space } from '@/lib/types';

export function OrgSpaceSettingsPage({
  params,
}: {
  params: { organizationslug: string; spaceslug: string };
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [space, setSpace] = useState<Space | null>(null);
  const [org, setOrg] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpaceAndOrg = async () => {
      if (!firestore || !params.spaceslug || !params.organizationslug) return;
      setIsLoading(true);

      const orgsRef = collection(firestore, 'accounts');
      const orgQuery = query(
        orgsRef,
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
        setIsLoading(false);
        return;
      }

      const spacesRef = collection(firestore, 'spaces');
      const q = query(
        spacesRef,
        where('slug', '==', params.spaceslug),
        where('ownerId', '==', currentOrg.id),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const spaceDoc = querySnapshot.docs[0];
        setSpace({ id: spaceDoc.id, ...spaceDoc.data() } as Space);
      } else {
        setSpace(null);
      }
      setIsLoading(false);
    };
    fetchSpaceAndOrg();
  }, [firestore, params.spaceslug, params.organizationslug]);

  const spaceDocRef = useMemo(
    () => (firestore && space ? doc(firestore, 'spaces', space.id) : null),
    [firestore, space]
  );

  const onSubmit = async (data: SpaceSettingsFormValues) => {
    if (!spaceDocRef) return;
    try {
      await updateDoc(spaceDocRef, data);
      toast({
        title: 'Success!',
        description: 'Space settings have been updated.',
      });
    } catch (error) {
      console.error('Error updating space:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update space settings.',
      });
    }
  };

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
            <Link href={`/organizations/${params.organizationslug}`}>
              {isLoading ? '...' : org?.name}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href={`/organizations/${params.organizationslug}/${params.spaceslug}`}
            >
              {isLoading ? '...' : space?.name}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <SpaceSettingsView
        space={space}
        isLoading={isLoading}
        breadcrumbs={breadcrumbs}
        onFormSubmit={onSubmit}
    />
  );
}
