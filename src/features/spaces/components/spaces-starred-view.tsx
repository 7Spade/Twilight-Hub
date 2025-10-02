/**
 * @fileoverview This component fetches and displays a list of spaces that a user has starred.
 * It queries the 'spaces' collection for documents where the current user's ID is in the
 * 'starredByUserIds' array. It then uses the generic `SpaceListView` component to
 * render the results, providing a consistent look and feel.
 * This file supersedes the old `starred-spaces-view.tsx`.
 */
'use client';

/**
 * This file supersedes the old `starred-spaces-view.tsx`.
 */

import React, { useMemo } from 'react';
import { collection, query, where, documentId } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import { SpaceListView } from '@/features/spaces/components/spaces-list-view';
import { type Account, type Space } from '@/lib/types';

export function SpaceStarredView({ userId }: { userId: string }) {
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
    <SpaceListView
      userId={userId}
      owners={ownersMap}
      isLoading={pageIsLoading}
      starredSpaces={starredSpaces || []}
      showStarredSpacesTab={true}
    />
  );
}
