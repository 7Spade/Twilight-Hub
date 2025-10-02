/**
 * @fileoverview Fetches and displays a list of organizations a given user is a member of.
 * It queries the `accounts` collection for documents of type 'organization'
 * where the `memberIds` array contains the specified `userId`.
 */

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where } from 'firebase/firestore';

import { useFirestore, useCollection } from '@/firebase';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users2 } from 'lucide-react';

function MembershipSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function MembershipList({ userId }: { userId: string }) {
  const firestore = useFirestore();

  const organizationsQuery = useMemo(
    () =>
      firestore && userId
        ? query(
            collection(firestore, 'accounts'),
            where('type', '==', 'organization'),
            where('memberIds', 'array-contains', userId)
          )
        : null,
    [firestore, userId]
  );
  const { data: organizations, isLoading } = useCollection(organizationsQuery);

  if (isLoading) {
    return <MembershipSkeleton />;
  }

  if (!organizations || organizations.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        This user is not a member of any organizations.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {organizations.map((org, index) => {
        const logo = getPlaceholderImage(`org-logo-${(index % 3) + 1}`);
        return (
          <Card key={org.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Image
                  src={logo.imageUrl}
                  alt={`${org.name} logo`}
                  width={56}
                  height={56}
                  className="rounded-lg border"
                  data-ai-hint={logo.imageHint}
                />
                <div>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>{org.memberIds?.length || 0} members</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-2">{org.description}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/organizations/${org.slug}`} className="w-full">
                <Button variant="outline" className="w-full">
                  <Users2 className="mr-2 h-4 w-4" />
                  View Organization
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
