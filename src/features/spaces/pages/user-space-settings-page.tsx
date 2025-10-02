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
import { type Space } from '@/lib/types';

export function UserSpaceSettingsPage({
  params,
}: {
  params: { userslug: string; spaceslug: string };
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpace = async () => {
      if (!firestore || !params.spaceslug) return;
      setIsLoading(true);
      const spacesRef = collection(firestore, 'spaces');
      const q = query(
        spacesRef,
        where('slug', '==', params.spaceslug),
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
    fetchSpace();
  }, [firestore, params.spaceslug]);

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
            <Link href="/spaces">Spaces</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${params.userslug}/${params.spaceslug}`}>
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
