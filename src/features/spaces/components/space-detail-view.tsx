'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirestore, useDoc } from '@/firebase';
import {
  collection,
  doc,
  query,
  where,
  documentId,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { Globe, Lock, Star } from 'lucide-react';
import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { User } from 'firebase/auth';
import { type Account, type Space } from '@/lib/types';
import { SpaceSettingsView, type SpaceSettingsFormValues } from './space-settings-view';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SpaceDetailViewProps {
  isLoading: boolean;
  space: Space | null;
  owner: Account | null;
  authUser: User | null;
  breadcrumbs: React.ReactNode;
}

export function SpaceDetailView({
  isLoading: isPageLoading,
  space,
  owner,
  authUser,
  breadcrumbs,
}: SpaceDetailViewProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const spaceDocRef = useMemo(
    () => (firestore && space ? doc(firestore, 'spaces', space.id) : null),
    [firestore, space]
  );

  const userProfileRef = useMemo(
    () => (firestore && authUser ? doc(firestore, 'accounts', authUser.uid) : null),
    [firestore, authUser]
  );
  const { data: userProfileData, isLoading: profileLoading } = useDoc<Account>(userProfileRef);
  

  const handleSettingsSubmit = async (data: SpaceSettingsFormValues) => {
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

  const isLoading = isPageLoading || profileLoading;

  if (isPageLoading) {
    return (
      <div className="flex flex-col gap-8">
        {breadcrumbs}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-10 w-10" />
        </div>
        <Skeleton className="h-5 w-96" />
        <div className="space-y-6">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!space || !owner) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Globe className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">Space not found</h3>
        <p className="text-sm text-muted-foreground">
          The space you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const isStarred = authUser?.uid ? space.starredByUserIds?.includes(authUser.uid) : false;

  const handleStarClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firestore || !authUser?.uid) return;
    const spaceRef = doc(firestore, 'spaces', space.id);
    await updateDoc(spaceRef, {
      starredByUserIds: isStarred ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
    });
  };

  const isOwner = authUser?.uid === owner.id;

  return (
    <div className="flex flex-col gap-8">
      {breadcrumbs}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {space.name}
          </h1>
          <Badge 
            variant={space.isPublic ? 'secondary' : 'outline'}
            className={cn(
              'transition-colors duration-200',
              space.isPublic 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {space.isPublic ? (
              <Globe className="mr-1 h-3 w-3" />
            ) : (
              <Lock className="mr-1 h-3 w-3" />
            )}
            {space.isPublic ? 'Public' : 'Private'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {authUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStarClick}
              className={cn(
                'transition-all duration-200',
                isStarred
                  ? 'text-yellow-500 hover:text-yellow-600 scale-110'
                  : 'text-muted-foreground hover:text-yellow-500 hover:scale-110'
              )}
            >
              <Star className={cn('h-5 w-5', isStarred && 'fill-current')} />
            </Button>
          )}
        </div>
      </div>
      <p className="text-muted-foreground text-lg leading-relaxed -mt-2">{space.description}</p>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isOwner && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Owner</h4>
                <p className="text-sm">{owner.name}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Visibility</h4>
                <p className="text-sm">{space.isPublic ? 'Public' : 'Private'}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        {isOwner && (
            <TabsContent value="settings" className="mt-6">
                <SpaceSettingsView 
                    space={space}
                    isLoading={isLoading}
                    onFormSubmit={handleSettingsSubmit}
                />
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
