'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PackagePlus,
  Puzzle,
  Search,
  CheckCircle,
  File,
  Backpack,
} from 'lucide-react';
import {
  useUser,
  useFirestore,
  useCollection,
  useDoc,
} from '@/firebase';
import { collection, doc, updateDoc, getDoc, setDoc, increment, query, where, documentId } from 'firebase/firestore';
import { useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/page-container';
import { useDialogStore } from '@/hooks/use-dialog-store';

const iconMap: { [key: string]: React.ElementType } = {
  default: Puzzle,
  'file-storage': File,
};

type ModuleInventory = {
    [moduleId: string]: number;
}


function MarketplaceTabContent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const modulesQuery = useMemo(
    () => (firestore ? collection(firestore, 'modules') : null),
    [firestore]
  );
  const { data: modules, isLoading: modulesLoading } = useCollection(modulesQuery);

  useEffect(() => {
    if (!firestore) return;

    const fileModuleId = 'file-storage-module';
    const moduleRef = doc(firestore, 'modules', fileModuleId);

    const checkAndCreateModule = async () => {
      const docSnap = await getDoc(moduleRef);
      if (!docSnap.exists()) {
        await setDoc(moduleRef, {
          name: 'File Storage',
          description: 'Upload and manage files for this space.',
          icon: 'file-storage',
          type: 'common',
        });
      }
    };

    checkAndCreateModule();
  }, [firestore]);


  const handleAddToBackpack = async (moduleId: string) => {
    if (!firestore || !user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to add modules to your backpack.",
        });
        return;
    }
    const userDocRef = doc(firestore, 'accounts', user.uid);
    
    const inventoryField = `moduleInventory.${moduleId}`;

    try {
        await updateDoc(userDocRef, {
            [inventoryField]: increment(1)
        });
        toast({
            title: "Module Added!",
            description: "A new module has been added to your backpack.",
        });
    } catch (error) {
        await setDoc(userDocRef, {
            moduleInventory: {
                [moduleId]: increment(1)
            }
        }, { merge: true });

        toast({
            title: "Module Added!",
            description: "Your backpack was updated with a new module.",
        });
    }
  };
  
  const isLoading = modulesLoading;

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-8">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Explore Modules</h2>
            <p className="text-muted-foreground">
                Discover new capabilities to enhance your spaces.
            </p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search modules..."
            className="pl-8 w-full md:w-[250px] lg:w-[300px]"
          />
        </div>
      </div>

      {isLoading && <p>Loading modules...</p>}

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules?.map((module) => {
            const Icon = iconMap[module.icon as string] || iconMap.default;
            return (
              <Card key={module.id} className="flex flex-col">
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  <div className="p-3 bg-muted rounded-lg">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <CardTitle>{module.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={'outline'}
                    className="w-full"
                    onClick={() => handleAddToBackpack(module.id)}
                  >
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Add to Backpack
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}


function BackpackTabContent() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { open: openDialog } = useDialogStore();

    const userProfileRef = useMemo(() => (
        firestore && user ? doc(firestore, 'accounts', user.uid) : null
    ), [firestore, user]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ moduleInventory?: ModuleInventory }>(userProfileRef);

    const moduleIds = useMemo(() => userProfile?.moduleInventory ? Object.keys(userProfile.moduleInventory) : [], [userProfile]);

    const modulesQuery = useMemo(() => {
        if (!firestore || moduleIds.length === 0) return null;
        return query(collection(firestore, 'modules'), where(documentId(), 'in', moduleIds));
    }, [firestore, moduleIds]);

    const { data: userModules, isLoading: areModulesLoading } = useCollection(modulesQuery);

    const isLoading = isProfileLoading || areModulesLoading;

    return (
        <>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Your Modules</h2>
                <p className="text-muted-foreground">
                    Here are the modules you've collected. Use them in your spaces.
                </p>
            </div>
        </div>

        {isLoading && <p>Loading modules...</p>}
      
        {!isLoading && userModules && userModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userModules.map((module) => {
                const Icon = iconMap[(module as any).icon] || iconMap.default;
                const quantity = userProfile?.moduleInventory?.[module.id] || 0;
                return (
                <Card key={module.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-muted rounded-lg">
                                    <Icon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <CardTitle>{(module as any).name}</CardTitle>
                            </div>
                            <Badge variant="secondary">Qty: {quantity}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                        {(module as any).description}
                    </p>
                    </CardContent>
                    <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => openDialog('useModule', { module: { id: module.id, name: module.name, type: module.type }})}
                    >
                      Use in a Space
                    </Button>
                    </CardFooter>
                </Card>
                );
            })}
            </div>
        ) : (
            !isLoading && (
                <Card className="flex flex-col items-center justify-center py-20 text-center col-span-full">
                    <CardHeader>
                        <div className="mx-auto bg-muted p-4 rounded-full mb-4">
                            <Backpack className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <CardTitle>Your Backpack is Empty</CardTitle>
                        <CardDescription>
                            Visit the Marketplace to discover and collect new modules for your spaces.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )
        )}
        </>
    );
}

export default function MarketplacePage() {
  return (
    <PageContainer
        title="Marketplace"
        description="Discover modules and manage your collection."
    >
      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="backpack">My Backpack</TabsTrigger>
        </TabsList>
        <TabsContent value="marketplace" className="mt-6">
          <MarketplaceTabContent />
        </TabsContent>
        <TabsContent value="backpack" className="mt-6">
           <BackpackTabContent />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
