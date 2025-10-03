'use client';
import React from 'react';
import { type User } from 'firebase/auth';
import { type Account, type Space } from '@/lib/types-unified';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { OverviewDashboard } from './overview';
import { FileExplorer } from './file-explorer';
import { ParticipantList } from './participants';
import { IssueList } from './issues';

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
        <div className="space-y-4">
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

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <OverviewDashboard spaceId={space.id} />
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              {authUser ? (
                <FileExplorer spaceId={space.id} userId={authUser.uid} />
              ) : (
                <Card>
                  <CardContent className="py-6 text-sm text-muted-foreground">
                    Please sign in to access files.
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="participants" className="mt-4">
              <ParticipantList
                spaceId={space.id}
                participants={[]}
                currentUserId={authUser?.uid}
                canManage={true}
                actions={{
                  onInvite: async () => {},
                  onRemove: async () => {},
                  onRoleChange: async () => {},
                  onExport: async () => {},
                }}
              />
            </TabsContent>

            <TabsContent value="issues" className="mt-4">
              <IssueList spaceId={space.id} canCreate={true} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}