'use client';
import React from 'react';
import { type User } from 'firebase/auth';
import { type Account, type Space } from '@/lib/types-unified';

interface SpacesDetailViewProps {
  isLoading: boolean;
  space: Space | null;
  owner: Account | null;
  authUser: User | null;
  breadcrumbs?: React.ReactNode;
}

export function SpacesDetailView({
  isLoading,
  space,
  owner,
  authUser,
  breadcrumbs,
}: SpacesDetailViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {breadcrumbs}
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          <div className="h-4 w-72 bg-muted animate-pulse rounded" />
          <div className="h-4 w-56 bg-muted animate-pulse rounded" />
        </div>
      ) : !space ? (
        <div className="text-muted-foreground">Space not found.</div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{space.name}</h2>
          {space.description && (
            <p className="text-sm text-muted-foreground">{space.description}</p>
          )}
          <div className="text-sm text-muted-foreground">
            Owner: {owner?.name ?? 'Unknown'}
          </div>
          {authUser && (
            <div className="text-xs text-muted-foreground">Signed in as {authUser.email ?? authUser.uid}</div>
          )}
        </div>
      )}
    </div>
  );
}