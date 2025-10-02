'use client';

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  useUser,
  useFirestore,
  useDoc,
  useCollection,
} from '@/firebase';
import {
  collection,
  doc,
  query,
  where,
  documentId,
  updateDoc,
  arrayUnion,
  getDocs,
  limit,
} from 'firebase/firestore';
import { File, Globe, Lock, PlusCircle, Puzzle, Settings } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { FileStorageModule } from '@/components/file-storage-module';

const iconMap: { [key: string]: React.ElementType } = {
  default: Puzzle,
  'file-storage': File,
};

// This card is for the "Add Modules" tab, showing modules from the user's backpack.
function ModuleCard({
  module,
  onAction,
  actionLabel,
  disabled = false,
}: {
  module: any;
  onAction: () => void;
  actionLabel: string;
  disabled?: boolean;
}) {
  const Icon = iconMap[module.icon as string] || iconMap.default;

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
        <Button
          className="w-full"
          onClick={onAction}
          disabled={disabled}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function SpaceDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ userslug: string, spaceslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const { user } = useUser();
  const firestore = useFirestore();
  const [space, setSpace] = useState<any>(null);
  const [spaceLoading, setSpaceLoading] = useState(true);
  const [hasFileModule, setHasFileModule] = useState(false);
  
  useEffect(() => {
    const fetchSpace = async () => {
        if (!firestore || !params.spaceslug) return;
        setSpaceLoading(true);
        const spacesRef = collection(firestore, 'spaces');
        const q = query(spacesRef, where('slug', '==', params.spaceslug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const spaceDoc = querySnapshot.docs[0];
            setSpace({ id: spaceDoc.id, ...spaceDoc.data() });
        } else {
            setSpace(null);
        }
        setSpaceLoading(false);
    }
    fetchSpace();
  }, [firestore, params.spaceslug]);
  
  const spaceDocRef = useMemo(
    () => (firestore && space ? doc(firestore, 'spaces', space.id) : null),
    [firestore, space]
  );

  // 2. Get the user's profile to know their backpack inventory
  const userProfileRef = useMemo(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: profileLoading } = useDoc<{
    moduleInventory?: { [key: string]: number };
  }>(userProfileRef);

  // 3. Get details for modules already "equipped" in the space
  const installedModuleIds = useMemo(() => space?.moduleIds || [], [space]);
  const installedModulesQuery = useMemo(() => {
    if (!firestore || installedModuleIds.length === 0) return null;
    return query(
      collection(firestore, 'modules'),
      where(documentId(), 'in', installedModuleIds)
    );
  }, [firestore, installedModuleIds]);
  const { data: installedModules, isLoading: installedModulesLoading } =
    useCollection(installedModulesQuery);
    
  // Check if the file module is equipped to render its functionality
  useEffect(() => {
    if (installedModuleIds.includes('file-storage-module')) {
      setHasFileModule(true);
    } else {
      setHasFileModule(false);
    }
  }, [installedModuleIds]);

  // 4. Get IDs of modules in user's backpack that are NOT yet equipped in this space
  const userInventoryIds = useMemo(() => (userProfile?.moduleInventory ? Object.keys(userProfile.moduleInventory) : []), [userProfile]);
  const availableToEquipIds = useMemo(() => {
    return userInventoryIds.filter((id) => !installedModuleIds.includes(id));
  }, [userInventoryIds, installedModuleIds]);

  // 5. Get details for those available-to-equip modules
  const availableModulesQuery = useMemo(() => {
    if (!firestore || availableToEquipIds.length === 0) return null;
    return query(
      collection(firestore, 'modules'),
      where(documentId(), 'in', availableToEquipIds)
    );
  }, [firestore, availableToEquipIds]);
  const { data: availableModules, isLoading: availableModulesLoading } =
    useCollection(availableModulesQuery);
    
  // --- Actions ---

  // "Equip" the module by adding its ID to the space's "equipment slot" array.
  const handleAddModuleToSpace = async (moduleId: string) => {
    if (!firestore || !spaceDocRef) return;
    await updateDoc(spaceDocRef, { 
      moduleIds: arrayUnion(moduleId) 
    });
  };

  // --- Render Logic ---

  const isLoading =
    spaceLoading ||
    profileLoading ||
    installedModulesLoading ||
    availableModulesLoading;

  if (spaceLoading) {
    return <div>Loading space...</div>;
  }

  if (!space) {
    return <div>Space not found.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/spaces">Spaces</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{space.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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

       {/* Conditionally render the feature if the module is "equipped" */}
       {hasFileModule && <FileStorageModule spaceId={space.id} />}

      <Tabs defaultValue="installed">
        <TabsList>
          <TabsTrigger value="installed">Installed Modules</TabsTrigger>
          <TabsTrigger value="add">Add Modules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Equipped Modules</h3>
          {isLoading && <p>Loading installed modules...</p>}
          {!isLoading &&
            installedModules &&
            installedModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {installedModules.map((mod) => {
                    const Icon = iconMap[mod.icon] || iconMap.default;
                    return (
                        <Card key={mod.id}>
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                <div className="p-3 bg-muted rounded-lg">
                                    <Icon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <CardTitle>{mod.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{mod.description}</p>
                            </CardContent>
                        </Card>
                    )
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
          <h3 className="text-lg font-medium mb-4">Available from Your Backpack</h3>
          {isLoading && <p>Loading available modules...</p>}
          {!isLoading &&
            availableModules &&
            availableModules.length > 0 ? (
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
                All modules from your backpack are already equipped in this space, or your backpack is empty.
                </p>
             )
          )}
        </TabsContent>
         <TabsContent value="settings" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Space Settings</CardTitle>
                    <CardDescription>Manage your space's details and configuration.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">To manage this space, go to the settings page.</p>
                </CardContent>
                <CardFooter>
                    <Link href={`/${params.userslug}/${params.spaceslug}/settings`}>
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
