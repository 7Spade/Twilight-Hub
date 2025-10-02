'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  useUser,
  useFirestore,
  useCollection,
} from '@/firebase';
import {
  collection,
  query,
  where,
  documentId,
} from 'firebase/firestore';
import { useDialogStore } from '@/hooks/use-dialog-store';
import { useMemo } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { SpacesView } from '@/features/spaces/components/spaces-view';

export default function SpacesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { open: openDialog } = useDialogStore();
  
  const userOrgsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'organizations'), where('memberIds', 'array-contains', user.uid));
  }, [firestore, user]);
  const { data: userOrgs, isLoading: userOrgsLoading } = useCollection(userOrgsQuery);

  const ownerIds = useMemo(() => {
    if (!user) return [];
    const ids = new Set<string>([user.uid]);
    (userOrgs || []).forEach(org => ids.add(org.id));
    return Array.from(ids);
  }, [user, userOrgs]);

  const allSpacesQuery = useMemo(() => firestore ? collection(firestore, 'spaces') : null, [firestore]);
  const {data: allSpaces, isLoading: allSpacesLoading } = useCollection(allSpacesQuery);
  
  const allOwnerIds = useMemo(() => {
      if (!allSpaces) return [];
      const ids = new Set<string>();
      allSpaces.forEach(space => ids.add(space.ownerId));
      return Array.from(ids);
  }, [allSpaces]);

  const ownersUsersQuery = useMemo(() => {
    if (!firestore || !allOwnerIds || allOwnerIds.length === 0) return null;
    return query(collection(firestore, 'users'), where(documentId(), 'in', allOwnerIds));
  }, [firestore, allOwnerIds]);

  const ownersOrgsQuery = useMemo(() => {
      if (!firestore || !allOwnerIds || allOwnerIds.length === 0) return null;
      return query(collection(firestore, 'organizations'), where(documentId(), 'in', allOwnerIds));
  }, [firestore, allOwnerIds]);

  const { data: ownerUsers, isLoading: ownersLoading } = useCollection(ownersUsersQuery);
  const { data: ownerOrgs, isLoading: orgsOwnerLoading } = useCollection(ownersOrgsQuery);


  const ownersMap = useMemo(() => {
      const map = new Map<string, any>();
      ownerUsers?.forEach(u => map.set(u.id, u));
      ownerOrgs?.forEach(o => map.set(o.id, o));
      return map;
  }, [ownerUsers, ownerOrgs]);


  const yourSpaces = useMemo(() => {
    if (!allSpaces || ownerIds.length === 0) return [];
    return allSpaces.filter(space => ownerIds.includes(space.ownerId));
  }, [allSpaces, ownerIds]);

  const starredSpaces = useMemo(() => {
    if (!allSpaces || !user) return [];
    return allSpaces.filter(space => space.starredByUserIds?.includes(user.uid));
  }, [allSpaces, user]);


  const publicSpaces = useMemo(() => {
    if (!allSpaces) return [];
    return allSpaces.filter(space => space.isPublic);
  }, [allSpaces]);
    
  const isLoading = allSpacesLoading || userOrgsLoading || ownersLoading || orgsOwnerLoading;

  return (
    <PageContainer
        title="Spaces"
        description="Build and customize your personal or team environments."
    >
      <div className="flex justify-end">
          <Button onClick={() => openDialog('createSpace')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Space
          </Button>
      </div>

      <SpacesView
        userId={user?.uid}
        owners={ownersMap}
        isLoading={isLoading}
        yourSpaces={yourSpaces}
        starredSpaces={starredSpaces}
        publicSpaces={publicSpaces}
        showYourSpacesTab={true}
        showStarredSpacesTab={true}
        showDiscoverTab={true}
      />

    </PageContainer>
  );
}
