/**
 * @fileoverview Fetches and displays a list of users who are following a given user.
 * It queries the `followers` subcollection for a specific `userId` and then
 * fetches the full account details for each follower to display their profile cards.
 */

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { collection, doc as _doc, query, where, documentId } from 'firebase/firestore';

import { useFirestore, useCollection } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlaceholderImage } from '@/lib/placeholder-images';

function FollowerSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex-row items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardHeader>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function FollowerList({ userId }: { userId: string }) {
  const firestore = useFirestore();

  const followersSubcollectionQuery = useMemo(
    () => (firestore ? collection(firestore, 'accounts', userId, 'followers') : null),
    [firestore, userId]
  );
  const { data: followerDocs, isLoading: followersLoading } = useCollection(
    followersSubcollectionQuery
  );

  const followerIds = useMemo(
    () => followerDocs?.map((doc) => doc.id) || [],
    [followerDocs]
  );

  const followersQuery = useMemo(
    () =>
      firestore && followerIds.length > 0
        ? query(
            collection(firestore, 'accounts'),
            where(documentId(), 'in', followerIds)
          )
        : null,
    [firestore, followerIds]
  );
  const { data: followers, isLoading: accountsLoading } =
    useCollection(followersQuery);

  const isLoading = followersLoading || accountsLoading;

  if (isLoading) {
    return <FollowerSkeleton />;
  }

  if (!followers || followers.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        This user has no followers yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {followers.map((follower) => (
        <Card key={follower.id}>
          <CardHeader className="flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={follower.avatarUrl || getPlaceholderImage('avatar-1').imageUrl}
                alt={follower.name}
              />
              <AvatarFallback>{follower.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{follower.name}</CardTitle>
              <CardDescription>@{follower.username}</CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/${follower.slug}`}>View Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
