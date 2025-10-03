/**
 * @fileoverview A component that fetches and displays a list of spaces starred by a specific user.
 * It first queries for all spaces where the `starredByUserIds` array contains the `userId`,
 * then fetches the account details of the space owners to construct the correct links.
 * It uses the reusable `SpaceListView` component to render the final list.
 */
'use client';

import React, { useMemo } from 'react';
import { collection, query, where, documentId } from 'firebase/firestore';

import { useFirestore, useCollection } from '@/firebase';
import { SpaceListView } from '@/components/features/spaces/components/spaces-list-view';
import { type Account, type Space } from '@/lib/types-unified';

export function StarredSpaces({ userId }: { userId: string }) {
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

  const { data: starredSpaces, isLoading } = useCollection<Space>(starredSpacesQuery);

  // We need to fetch the owners of these spaces to generate correct links
  const ownerIds = useMemo(() => {
    if (!starredSpaces) return [];
    const ids = new Set<string>();
    starredSpaces.forEach((space) => ids.add(space.ownerId));
    return Array.from(ids);
  }, [starredSpaces]);

  const ownersQuery = useMemo(() => {
    if (!firestore || !ownerIds || ownerIds.length === 0) return null;
    return query(collection(firestore, 'accounts'), where(documentId(), 'in', ownerIds));
  }, [firestore, ownerIds]);

  const { data: owners, isLoading: ownersLoading } = useCollection<Account>(ownersQuery);

  const ownersMap = useMemo(() => {
    const map = new Map<string, Account>();
    owners?.forEach((o) => map.set(o.id, o));
    return map;
  }, [owners]);

  const pageIsLoading = isLoading || ownersLoading;

  return (
    <SpaceListView
      userId={userId}
      owners={ownersMap}
      isLoading={pageIsLoading}
      starredSpaces={starredSpaces}
      showStarredSpacesTab={true}
    />
  );
}
