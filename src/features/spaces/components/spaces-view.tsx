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
import { Star, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { type Account, type Space } from '@/lib/types';

const SpaceCard = ({
  space,
  userId,
  owner,
}: {
  space: Space;
  userId: string | undefined;
  owner?: Account;
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
  emptyStateMessage = 'No spaces found.',
}: {
  spaces: Space[] | null;
  isLoading: boolean;
  userId: string | undefined;
  owners: Map<string, Account>;
  emptyStateMessage?: string;
}) => {
  if (isLoading) {
    return <p>Loading spaces...</p>;
  }
  if (!spaces || spaces.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>{emptyStateMessage}</p>
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


interface SpacesViewProps {
    userId?: string;
    owners: Map<string, Account>;
    isLoading: boolean;

    // Different sets of spaces for the tabs
    yourSpaces?: Space[] | null;
    starredSpaces?: Space[] | null;
    publicSpaces?: Space[] | null;
    organizationSpaces?: Space[] | null;

    // Configuration for tabs
    showYourSpacesTab?: boolean;
    showStarredSpacesTab?: boolean;
    showDiscoverTab?: boolean;
    showOrganizationSpacesTab?: boolean;
}

export function SpacesView({
    userId,
    owners,
    isLoading,
    yourSpaces,
    starredSpaces,
    publicSpaces,
    organizationSpaces,
    showYourSpacesTab = false,
    showStarredSpacesTab = false,
    showDiscoverTab = false,
    showOrganizationSpacesTab = false
}: SpacesViewProps) {

    const tabs: { value: string; label: string; data: Space[] | null; empty: string; }[] = [];
    if(showOrganizationSpacesTab) tabs.push({ value: 'org', label: 'Organization Spaces', data: organizationSpaces || null, empty: 'No spaces found for this organization.' });
    if(showYourSpacesTab) tabs.push({ value: 'yours', label: 'Your Spaces', data: yourSpaces || null, empty: 'You have not created any spaces.' });
    if(showStarredSpacesTab) tabs.push({ value: 'starred', label: 'Starred', data: starredSpaces || null, empty: 'You have not starred any spaces.' });
    if(showDiscoverTab) tabs.push({ value: 'discover', label: 'Discover', data: publicSpaces || null, empty: 'No public spaces available to discover.' });

    if (tabs.length === 0) {
        return null; // or some default view
    }

    if (tabs.length === 1) {
        const tab = tabs[0];
        return (
             <SpacesGrid
                spaces={tab.data}
                isLoading={isLoading}
                userId={userId}
                owners={owners}
                emptyStateMessage={tab.empty}
            />
        )
    }

    return (
        <Tabs defaultValue={tabs[0].value}>
            <TabsList className={`grid w-full grid-cols-${tabs.length} md:w-[${tabs.length * 100}px]`}>
               {tabs.map(tab => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
            </TabsList>
            {tabs.map(tab => (
                 <TabsContent key={tab.value} value={tab.value} className="mt-6">
                    <SpacesGrid
                        spaces={tab.data}
                        isLoading={isLoading}
                        userId={userId}
                        owners={owners}
                        emptyStateMessage={tab.empty}
                    />
                </TabsContent>
            ))}
      </Tabs>
    )
}
