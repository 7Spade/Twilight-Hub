/**
 * @fileoverview Fetches and displays a list of users that a given user is following.
 * It queries the `following` subcollection for a specific `userId` and then
 * fetches the full account details for each followed user to display their profile cards.
 */

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { collection, query, where, documentId } from 'firebase/firestore';

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
import { type Account } from '@/lib/types';

function FollowingSkeleton() {
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

export function FollowingList({ userId }: { userId: string }) {
  const firestore = useFirestore();

  const followingSubcollectionQuery = useMemo(
    () => (firestore ? collection(firestore, 'accounts', userId, 'following') : null),
    [firestore, userId]
  );
  const { data: followingDocs, isLoading: followingLoading } = useCollection(
    followingSubcollectionQuery
  );

  const followingIds = useMemo(
    () => followingDocs?.map((doc) => doc.id) || [],
    [followingDocs]
  );

  const followingQuery = useMemo(
    () =>
      firestore && followingIds.length > 0
        ? query(
            collection(firestore, 'accounts'),
            where(documentId(), 'in', followingIds)
          )
        : null,
    [firestore, followingIds]
  );
  const { data: following, isLoading: accountsLoading } =
    useCollection<Account>(followingQuery);

  const isLoading = followingLoading || accountsLoading;

  if (isLoading) {
    return <FollowingSkeleton />;
  }

  if (!following || following.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        This user isn't following anyone yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {following.map((user) => (
        <Card key={user.id}>
          <CardHeader className="flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={user.avatarUrl || getPlaceholderImage('avatar-1').imageUrl}
                alt={user.name}
              />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/${user.slug}`}>View Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
