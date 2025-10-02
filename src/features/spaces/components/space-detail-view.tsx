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
  arrayRemove,
} from 'firebase/firestore';
import { File, Globe, Lock, PlusCircle, Puzzle, Settings, ClipboardList, Video, ListChecks, HelpCircle, Image as ImageIcon, BarChart, Sparkles, Send, Archive, FileDiff, CalendarRange, FileStack, DollarSign, CheckCircle2, Star } from 'lucide-react';
import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { FilesModule } from '@/features/marketplace/components/files-module';
import { IssuesModule } from '@/features/marketplace/components/issues-module';
import { MeetingsModule } from '@/features/marketplace/components/meetings-module';
import { FormsModule } from '@/features/marketplace/components/forms-module';
import { RfiModule } from '@/features/marketplace/components/rfi-module';
import { PhotosModule } from '@/features/marketplace/components/photos-module';
import { ReportsModule } from '@/features/marketplace/components/reports-module';
import { AiAssistantModule } from '@/features/marketplace/components/ai-assistant-module';
import { SubmittalsModule } from '@/features/marketplace/components/submittals-module';
import { AssetsModule } from '@/features/marketplace/components/assets-module';
import { ChangesModule } from '@/features/marketplace/components/changes-module';
import { ScheduleModule } from '@/features/marketplace/components/schedule-module';
import { SheetsModule } from '@/features/marketplace/components/sheets-module';
import { CostModule } from '@/features/marketplace/components/cost-module';
import { PunchListModule } from '@/features/marketplace/components/punch-list-module';
import { User } from 'firebase/auth';
import { type Account, type Space, type Module } from '@/lib/types';
import { SpaceSettingsView, type SpaceSettingsFormValues } from './space-settings-view';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const iconMap: { [key: string]: React.ElementType } = {
  'file-storage': File,
  'clipboard-list': ClipboardList,
  'video': Video,
  'list-checks': ListChecks,
  'help-circle': HelpCircle,
  'image': ImageIcon,
  'bar-chart': BarChart,
  'sparkles': Sparkles,
  'send': Send,
  'archive': Archive,
  'file-diff': FileDiff,
  'calendar-range': CalendarRange,
  'file-stack': FileStack,
  'dollar-sign': DollarSign,
  'check-circle-2': CheckCircle2,
  default: Puzzle,
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
  
  const hasModule = (id: string) => installedModuleIds.includes(id);

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
            <h1 className="text-3xl font-bold tracking-tight">{space.name}</h1>
             <Badge variant={space.isPublic ? 'secondary' : 'outline'}>
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
                  isStarred
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-muted-foreground hover:text-yellow-400'
                )}
              >
                <Star className={cn(isStarred && 'fill-current')} />
              </Button>
            )}
        </div>
      </div>
       <p className="text-muted-foreground -mt-4">{space.description}</p>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Add Modules</TabsTrigger>
          {isOwner && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
            <h3 className="text-lg font-medium mb-4">Installed Modules</h3>
            {isLoading && <p>Loading installed modules...</p>}

            <div className="space-y-8">
                {hasModule('files-module') && <FilesModule spaceId={space.id} />}
                {hasModule('issues-module') && <IssuesModule />}
                {hasModule('meetings-module') && <MeetingsModule />}
                {hasModule('forms-module') && <FormsModule />}
                {hasModule('rfi-module') && <RfiModule />}
                {hasModule('photos-module') && <PhotosModule />}
                {hasModule('reports-module') && <ReportsModule />}
                {hasModule('ai-assistant-module') && <AiAssistantModule />}
                {hasModule('submittals-module') && <SubmittalsModule />}
                {hasModule('assets-module') && <AssetsModule />}
                {hasModule('changes-module') && <ChangesModule />}
                {hasModule('schedule-module') && <ScheduleModule />}
                {hasModule('sheets-module') && <SheetsModule />}
                {hasModule('cost-module') && <CostModule />}
                {hasModule('punch-list-module') && <PunchListModule />}
            </div>

            {!isLoading && installedModules.length === 0 && (
                 <p className="text-muted-foreground mt-4">
                    No modules installed in this space yet.
                </p>
            )}
        </TabsContent>

        <TabsContent value="modules" className="mt-6">
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
                All modules from your backpack are already installed in this
                space, or your backpack is empty.
              </p>
            )
          )}
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
