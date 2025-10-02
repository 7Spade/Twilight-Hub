'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Star, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  useUser,
  useFirestore,
  useCollection,
} from '@/firebase';
import {
  collection,
  query,
  where,
  arrayUnion,
  arrayRemove,
  doc,
  updateDoc,
  documentId,
} from 'firebase/firestore';
import { useDialogStore } from '@/hooks/use-dialog-store';
import { useMemo } from 'react';
import { type Team } from '../layout';
import { PageContainer } from '@/components/layout/page-container';

const SpaceCard = ({
  space,
  userId,
  owner,
}: {
  space: any;
  userId: string | undefined;
  owner?: any;
}) => {
  const firestore = useFirestore();
  const isStarred = userId ? space.starredByUserIds?.includes(userId) : false;

  const handleStarClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the star
    if (!firestore || !userId) return;
    const spaceRef = doc(firestore, 'spaces', space.id);
    await updateDoc(spaceRef, {
      starredByUserIds: isStarred ? arrayRemove(userId) : arrayUnion(userId),
    });
  };
  
  let spaceUrl = '#'; // Default fallback URL
  if (owner && owner.slug && space.slug) {
      if (space.ownerType === 'user') {
          spaceUrl = `/${owner.slug}/${space.slug}`;
      } else {
          spaceUrl = `/organizations/${owner.slug}/${space.slug}`;
      }
  }


  return (
    <Card key={space.id} className="flex flex-col">
       <Link href={spaceUrl} className="flex flex-col flex-grow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{space.name}</CardTitle>
                <CardDescription>{space.description}</CardDescription>
              </div>
              {userId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStarClick}
                  className={cn(
                    'z-10', // ensure button is clickable over link
                    isStarred
                      ? 'text-yellow-400'
                      : 'text-muted-foreground hover:text-yellow-400'
                  )}
                >
                  <Star className={cn(isStarred && 'fill-current')} />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <Badge variant={space.isPublic ? 'secondary' : 'outline'}>
              {space.isPublic ? (
                <Globe className="mr-1 h-3 w-3" />
              ) : (
                <Lock className="mr-1 h-3 w-3" />
              )}
              {space.isPublic ? 'Public' : 'Private'}
            </Badge>
          </CardContent>
        </Link>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
            <Link href={spaceUrl}>Enter Space</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const SpacesGrid = ({
  spaces,
  isLoading,
  userId,
  owners,
}: {
  spaces: any[] | null;
  isLoading: boolean;
  userId: string | undefined;
  owners: Map<string, any>;
}) => {
  if (isLoading) {
    return <p>Loading spaces...</p>;
  }
  if (!spaces || spaces.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No spaces found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} userId={userId} owner={owners.get(space.ownerId)} />
      ))}
    </div>
  );
};

export default function SpacesPage({ selectedTeam }: { selectedTeam: Team | null }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { open: openDialog } = useDialogStore();
  
  const userOrgsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'organizations'), where('memberIds', 'array-contains', user.uid));
  }, [firestore, user]);
  const { data: userOrgs, isLoading: userOrgsLoading } = useCollection(userOrgsQuery);

  const ownerIds = useMemo(() => {
    if (!user) return [];
    const ids = new Set<string>([user.uid]);
    (userOrgs || []).forEach(org => ids.add(org.id));
    return Array.from(ids);
  }, [user, userOrgs]);

  // Combined query for all spaces to get all potential owners
  const allSpacesQuery = useMemo(() => firestore ? collection(firestore, 'spaces') : null, [firestore]);
  const {data: allSpaces, isLoading: allSpacesLoading } = useCollection(allSpacesQuery);
  
  const allOwnerIds = useMemo(() => {
      if (!allSpaces) return [];
      const ids = new Set<string>();
      allSpaces.forEach(space => ids.add(space.ownerId));
      return Array.from(ids);
  }, [allSpaces]);


  // Use a map to store queries for users and orgs to avoid re-renders
  const ownerQueries = useMemo(() => {
    if (!firestore || !allOwnerIds || allOwnerIds.length === 0) return { userQuery: null, orgQuery: null };
    
    // We need to fetch all owners, not just the current user and their orgs
    const userQuery = query(collection(firestore, 'users'), where(documentId(), 'in', allOwnerIds));
    const orgQuery = query(collection(firestore, 'organizations'), where(documentId(), 'in', allOwnerIds));

    return { userQuery, orgQuery };
  }, [firestore, allOwnerIds]);

  const { data: ownerUsers, isLoading: ownersLoading } = useCollection(ownerQueries.userQuery);
  const { data: ownerOrgs, isLoading: orgsOwnerLoading } = useCollection(ownerQueries.orgQuery);

  const ownersMap = useMemo(() => {
      const map = new Map<string, any>();
      ownerUsers?.forEach(u => map.set(u.id, u));
      ownerOrgs?.forEach(o => map.set(o.id, o));
      return map;
  }, [ownerUsers, ownerOrgs]);


  const yourSpaces = useMemo(() => {
    if (!allSpaces || ownerIds.length === 0) return [];
    return allSpaces.filter(space => ownerIds.includes(space.ownerId));
  }, [allSpaces, ownerIds]);

  const starredSpaces = useMemo(() => {
    if (!allSpaces || !user) return [];
    return allSpaces.filter(space => space.starredByUserIds?.includes(user.uid));
  }, [allSpaces, user]);


  const publicSpaces = useMemo(() => {
    if (!allSpaces) return [];
    return allSpaces.filter(space => space.isPublic);
  }, [allSpaces]);
    
  const tabTitle = "Your Spaces";

  const isLoading = allSpacesLoading || userOrgsLoading || ownersLoading || orgsOwnerLoading;

  return (
    <PageContainer
        title="Spaces"
        description="Build and customize your personal or team environments."
    >
      <div className="flex justify-end">
          <Button onClick={() => openDialog('createSpace')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Space
          </Button>
      </div>

      <Tabs defaultValue="yours">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="yours">{tabTitle}</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>
        <TabsContent value="yours" className="mt-6">
          <SpacesGrid
            spaces={yourSpaces}
            isLoading={isLoading}
            userId={user?.uid}
            owners={ownersMap}
          />
        </TabsContent>
        <TabsContent value="starred" className="mt-6">
          <SpacesGrid
            spaces={starredSpaces}
            isLoading={isLoading}
            userId={user?.uid}
            owners={ownersMap}
          />
        </TabsContent>
        <TabsContent value="discover" className="mt-6">
          <SpacesGrid
            spaces={publicSpaces}
            isLoading={isLoading}
            userId={user?.uid}
            owners={ownersMap}
          />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
