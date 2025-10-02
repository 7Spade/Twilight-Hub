
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useFirestore, useDoc, useCollection } from '@/firebase';
import {
  collection,
  doc,
  query,
  where,
  documentId,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { File, Globe, Lock, PlusCircle, Puzzle, Settings } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { FileStorageModule } from '@/features/marketplace/components/file-storage-module';
import { User } from 'firebase/auth';
import { type Account, type Space, type Module } from '@/lib/types';
import { IssuesPlaceholder } from '@/features/marketplace/components/issues-placeholder';

const iconMap: { [key: string]: React.ElementType } = {
  default: Puzzle,
  'file-storage': File,
};

function ModuleCard({
  module,
  onAction,
  actionLabel,
  disabled = false,
}: {
  module: Module;
  onAction: () => void;
  actionLabel: string;
  disabled?: boolean;
}) {
  const Icon = iconMap[module.icon || 'default'] || iconMap.default;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <div className="p-3 bg-muted rounded-lg">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle>{module.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onAction} disabled={disabled}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

interface SpaceDetailViewProps {
  isLoading: boolean;
  space: Space | null;
  owner: Account | null;
  authUser: User | null;
  breadcrumbs: React.ReactNode;
  basePath: string;
}

export function SpaceDetailView({
  isLoading: isPageLoading,
  space,
  owner,
  authUser,
  breadcrumbs,
  basePath
}: SpaceDetailViewProps) {
  const firestore = useFirestore();
  const [hasFileModule, setHasFileModule] = useState(false);

  const spaceDocRef = useMemo(
    () => (firestore && space ? doc(firestore, 'spaces', space.id) : null),
    [firestore, space]
  );

  const userProfileRef = useMemo(
    () => (firestore && authUser ? doc(firestore, 'accounts', authUser.uid) : null),
    [firestore, authUser]
  );
  const { data: userProfileData, isLoading: profileLoading } = useDoc<Account>(userProfileRef);
  const userProfile = userProfileData;

  const installedModuleIds = useMemo(() => space?.moduleIds || [], [space]);
  const installedModulesQuery = useMemo(() => {
    if (!firestore || installedModuleIds.length === 0) return null;
    return query(
      collection(firestore, 'modules'),
      where(documentId(), 'in', installedModuleIds)
    );
  }, [firestore, installedModuleIds]);
  const { data: installedModulesData, isLoading: installedModulesLoading } =
    useCollection<Module>(installedModulesQuery);
  const installedModules = installedModulesData || [];

  useEffect(() => {
    setHasFileModule(installedModuleIds.includes('file-storage-module'));
  }, [installedModuleIds]);

  const userInventoryIds = useMemo(
    () => (userProfile?.moduleInventory ? Object.keys(userProfile.moduleInventory) : []),
    [userProfile]
  );
  const availableToEquipIds = useMemo(
    () => userInventoryIds.filter((id) => !installedModuleIds.includes(id)),
    [userInventoryIds, installedModuleIds]
  );

  const availableModulesQuery = useMemo(() => {
    if (!firestore || availableToEquipIds.length === 0) return null;
    return query(
      collection(firestore, 'modules'),
      where(documentId(), 'in', availableToEquipIds)
    );
  }, [firestore, availableToEquipIds]);
  const { data: availableModulesData, isLoading: availableModulesLoading } =
    useCollection<Module>(availableModulesQuery);
  const availableModules = availableModulesData || [];

  const handleAddModuleToSpace = async (moduleId: string) => {
    if (!firestore || !spaceDocRef) return;
    await updateDoc(spaceDocRef, {
      moduleIds: arrayUnion(moduleId),
    });
  };

  const isLoading =
    isPageLoading ||
    profileLoading ||
    installedModulesLoading ||
    availableModulesLoading;

  if (isPageLoading) {
    return <div>Loading space...</div>;
  }

  if (!space || !owner) {
    return <div>Space or Owner not found.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {breadcrumbs}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{space.name}</h1>
          <p className="text-muted-foreground">{space.description}</p>
        </div>
        <Badge variant={space.isPublic ? 'secondary' : 'outline'}>
          {space.isPublic ? (
            <Globe className="mr-1 h-3 w-3" />
          ) : (
            <Lock className="mr-1 h-3 w-3" />
          )}
          {space.isPublic ? 'Public' : 'Private'}
        </Badge>
      </div>

      <div className="space-y-8">
        {hasFileModule && <FileStorageModule spaceId={space.id} />}
        <IssuesPlaceholder />
      </div>

      <Tabs defaultValue="installed">
        <TabsList>
          <TabsTrigger value="installed">Installed Modules</TabsTrigger>
          <TabsTrigger value="add">Add Modules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Equipped Modules</h3>
          {isLoading && <p>Loading installed modules...</p>}
          {!isLoading && installedModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {installedModules.map((mod) => {
                const Icon = iconMap[mod.icon || 'default'] || iconMap.default;
                return (
                  <Card key={mod.id}>
                    <CardHeader className="flex-row items-center gap-4 space-y-0">
                      <div className="p-3 bg-muted rounded-lg">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <CardTitle>{mod.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {mod.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            !isLoading && (
              <p className="text-muted-foreground mt-4">
                No modules equipped in this space yet.
              </p>
            )
          )}
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <h3 className="text-lg font-medium mb-4">
            Available from Your Backpack
          </h3>
          {isLoading && <p>Loading available modules...</p>}
          {!isLoading && availableModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableModules.map((mod) => (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  actionLabel="Add to Space"
                  onAction={() => handleAddModuleToSpace(mod.id)}
                />
              ))}
            </div>
          ) : (
            !isLoading && (
              <p className="text-muted-foreground mt-4">
                All modules from your backpack are already equipped in this
                space, or your backpack is empty.
              </p>
            )
          )}
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Space Settings</CardTitle>
              <CardDescription>
                Manage your space's details and configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To manage this space, go to the settings page.
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`${basePath}/settings`}>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Go to Settings
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
