'use client';

import React, { useMemo } from 'react';
import { collection, query, where, documentId } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import { SpacesView } from '@/features/spaces/components/spaces-view';
import { type Account } from '@/lib/types';

export function StarredSpacesView({ userId }: { userId: string }) {
  const firestore = useFirestore();

  const starredSpacesQuery = useMemo(
    () =>
      firestore && userId
        ? query(
            collection(firestore, 'spaces'),
            where('starredByUserIds', 'array-contains', userId)
          )
        : null,
    [firestore, userId]
  );

  const { data: starredSpaces, isLoading } = useCollection(starredSpacesQuery);

  const ownerIds = useMemo(() => {
    if (!starredSpaces) return [];
    const ids = new Set<string>();
    starredSpaces.forEach((space) => ids.add(space.ownerId));
    return Array.from(ids);
  }, [starredSpaces]);

  const ownersQuery = useMemo(() => {
    if (!firestore || !ownerIds || ownerIds.length === 0) return null;
    return query(
      collection(firestore, 'accounts'),
      where(documentId(), 'in', ownerIds)
    );
  }, [firestore, ownerIds]);
  const { data: owners, isLoading: ownersLoading } = useCollection<Account>(ownersQuery);

  const ownersMap = useMemo(() => {
    const map = new Map<string, Account>();
    owners?.forEach((o) => map.set(o.id, o));
    return map;
  }, [owners]);

  const pageIsLoading = isLoading || ownersLoading;

  return (
    <SpacesView
      userId={userId}
      owners={ownersMap}
      isLoading={pageIsLoading}
      starredSpaces={starredSpaces || []}
      showStarredSpacesTab={true}
    />
  );
}
