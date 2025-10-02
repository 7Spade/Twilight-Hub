'use client';

import { useMemo } from 'react';
import { collection, query, where, documentId } from 'firebase/firestore';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useDialogStore } from '@/hooks/use-dialog-store';
import { PageContainer } from '@/components/layout/page-container';
import { SpaceListView } from '@/features/spaces/components/spaces-list-view';
import { type Account, type Space } from '@/lib/types';

export default function UnifiedSpacesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { open: openDialog } = useDialogStore();

  const userOrgsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'accounts'),
      where('type', '==', 'organization'),
      where('memberIds', 'array-contains', user.uid)
    );
  }, [firestore, user]);
  const { data: userOrgs, isLoading: userOrgsLoading } =
    useCollection<Account>(userOrgsQuery);

  const ownerIds = useMemo(() => {
    if (!user) return [];
    const ids = new Set<string>([user.uid]);
    (userOrgs || []).forEach((org) => ids.add(org.id));
    return Array.from(ids);
  }, [user, userOrgs]);

  const allSpacesQuery = useMemo(
    () => (firestore ? collection(firestore, 'spaces') : null),
    [firestore]
  );
  const { data: allSpacesData, isLoading: allSpacesLoading } =
    useCollection<Space>(allSpacesQuery);
  const allSpaces = allSpacesData || [];

  const allOwnerIds = useMemo(() => {
    if (allSpaces.length === 0) return [];
    const ids = new Set<string>();
    allSpaces.forEach((space) => ids.add(space.ownerId));
    return Array.from(ids);
  }, [allSpaces]);

  const ownersQuery = useMemo(() => {
    if (!firestore || !allOwnerIds || allOwnerIds.length === 0) return null;
    return query(
      collection(firestore, 'accounts'),
      where(documentId(), 'in', allOwnerIds)
    );
  }, [firestore, allOwnerIds]);
  const { data: ownersData, isLoading: ownersLoading } =
    useCollection<Account>(ownersQuery);

  const ownersMap = useMemo(() => {
    const map = new Map<string, Account>();
    ownersData?.forEach((o) => map.set(o.id, o));
    return map;
  }, [ownersData]);

  const yourSpaces = useMemo(() => {
    if (allSpaces.length === 0 || ownerIds.length === 0) return [];
    return allSpaces.filter((space) => ownerIds.includes(space.ownerId));
  }, [allSpaces, ownerIds]);

  const starredSpaces = useMemo(() => {
    if (allSpaces.length === 0 || !user) return [];
    return allSpaces.filter((space) =>
      space.starredByUserIds?.includes(user.uid)
    );
  }, [allSpaces, user]);

  const publicSpaces = useMemo(() => {
    if (allSpaces.length === 0) return [];
    return allSpaces.filter((space) => space.isPublic);
  }, [allSpaces]);

  const isLoading = allSpacesLoading || userOrgsLoading || ownersLoading;

  return (
    <PageContainer
      title="Spaces"
      description="Build and customize your collaborative workspaces."
    >
      <div className="flex justify-end">
        <Button onClick={() => openDialog('createSpace')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Space
        </Button>
      </div>

      <SpaceListView
        userId={user?.uid}
        owners={ownersMap}
        isLoading={isLoading}
        yourSpaces={yourSpaces}
        starredSpaces={starredSpaces}
        publicSpaces={publicSpaces}
        showYourSpacesTab={true}
        showStarredSpacesTab={true}
        showDiscoverTab={true}
        showSearch={true}
        showFilters={true}
      />
    </PageContainer>
  );
}