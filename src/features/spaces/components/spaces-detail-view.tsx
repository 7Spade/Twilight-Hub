'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Lock } from 'lucide-react';
import React from 'react';
import { SpaceVisibilityBadge } from '@/features/spaces/components/spaces-visibility-badge';
import { Skeleton } from '@/components/ui/skeleton';

import { User } from 'firebase/auth';
import { type Account, type Space } from '@/lib/types';
import { SpaceSettingsView, type SpaceSettingsFormValues } from './spaces-settings-view';
import { cn } from '@/lib/utils';
import { SpaceStarButton } from '@/features/spaces/components/spaces-star-button';
import { FileManager } from './spaces-files-view';
import { useSpaceActions } from '@/features/spaces/hooks';

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
  const { updateSpace } = useSpaceActions();

  const handleSettingsSubmit = async (data: SpaceSettingsFormValues) => {
    if (!space) return;
    await updateSpace(space.id, data);
  };

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

  const isStarred = !!(authUser?.uid && space.starredByUserIds?.includes(authUser.uid));

  const isOwner = authUser?.uid === owner.id;

  return (
    <div className="flex flex-col gap-8">
      {breadcrumbs}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {space.name}
          </h1>
          <SpaceVisibilityBadge isPublic={space.isPublic} />
        </div>
        <div className="flex items-center gap-2">
          {authUser && (
            <SpaceStarButton spaceId={space.id} userId={authUser.uid} isStarred={isStarred} />
          )}
        </div>
      </div>
      <p className="text-muted-foreground text-lg leading-relaxed -mt-2">{space.description}</p>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
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

        <TabsContent value="files" className="mt-6">
          {authUser && (
            <FileManager spaceId={space.id} userId={authUser.uid} />
          )}
        </TabsContent>

        {isOwner && (
            <TabsContent value="settings" className="mt-6">
                <SpaceSettingsView 
                    space={space}
                    isLoading={isPageLoading}
                    onFormSubmit={handleSettingsSubmit}
                />
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
