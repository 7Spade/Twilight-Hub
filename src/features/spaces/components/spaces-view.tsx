'use client';

/**
 * @fileoverview A versatile view component for displaying lists of spaces in various contexts.
 * It uses a tabbed interface to switch between different lists of spaces, such as "Your Spaces",
 * "Starred", "Organization Spaces", and "Discover". It handles the presentation logic
 * for each tab and provides a consistent look and feel for space cards.
 */

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Globe, Lock, Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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
  spaceUrl = space.slug ? `/spaces/${space.slug}` : '#';

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      <CardHeader className="relative pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate group-hover:text-blue-600 transition-colors">
              {space.name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {space.description}
            </CardDescription>
          </div>
          {userId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStarClick}
              className={cn(
                'z-10 flex-shrink-0 transition-all duration-200',
                isStarred
                  ? 'text-yellow-500 hover:text-yellow-600 scale-110'
                  : 'text-muted-foreground hover:text-yellow-500 hover:scale-110'
              )}
            >
              <Star className={cn('h-4 w-4', isStarred && 'fill-current')} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="relative pb-3">
        <div className="flex items-center justify-between">
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
          
          {owner && (
            <div className="text-xs text-muted-foreground truncate max-w-[120px]">
              by {owner.name}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="relative pt-0">
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200" 
          asChild
        >
          <Link href={spaceUrl}>Enter Space</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const SpaceCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-1" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="pb-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </CardContent>
    <CardFooter className="pt-0">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SpaceCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  if (!spaces || spaces.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Globe className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No spaces found</h3>
        <p className="text-sm text-muted-foreground">{emptyStateMessage}</p>
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
    
    // Search and filtering
    showSearch?: boolean;
    showFilters?: boolean;
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
    showOrganizationSpacesTab = false,
    showSearch = false,
    showFilters = false
}: SpacesViewProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');

    // Filter spaces based on search query and visibility filter
    const filterSpaces = useMemo(() => {
        return (spaces: Space[] | null | undefined) => {
            if (!spaces) return null;
            
            let filtered = spaces;
            
            // Apply search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter(space => 
                    space.name.toLowerCase().includes(query) ||
                    space.description?.toLowerCase().includes(query) ||
                    owners.get(space.ownerId)?.name.toLowerCase().includes(query)
                );
            }
            
            // Apply visibility filter
            if (visibilityFilter !== 'all') {
                filtered = filtered.filter(space => 
                    visibilityFilter === 'public' ? space.isPublic : !space.isPublic
                );
            }
            
            return filtered;
        };
    }, [searchQuery, visibilityFilter, owners]);

    const tabs = useMemo(() => {
        const tabConfigs = [
            { 
                condition: showOrganizationSpacesTab, 
                value: 'org', 
                label: 'Organization Spaces', 
                data: filterSpaces(organizationSpaces), 
                empty: 'No spaces found for this organization.' 
            },
            { 
                condition: showYourSpacesTab, 
                value: 'yours', 
                label: 'Your Spaces', 
                data: filterSpaces(yourSpaces), 
                empty: 'You have not created any spaces.' 
            },
            { 
                condition: showStarredSpacesTab, 
                value: 'starred', 
                label: 'Starred', 
                data: filterSpaces(starredSpaces), 
                empty: 'You have not starred any spaces.' 
            },
            { 
                condition: showDiscoverTab, 
                value: 'discover', 
                label: 'Discover', 
                data: filterSpaces(publicSpaces), 
                empty: 'No public spaces available to discover.' 
            }
        ];
        
        return tabConfigs
            .filter(config => config.condition)
            .map(config => ({
                value: config.value,
                label: config.label,
                data: config.data,
                empty: config.empty
            }));
    }, [showOrganizationSpacesTab, showYourSpacesTab, showStarredSpacesTab, showDiscoverTab, organizationSpaces, yourSpaces, starredSpaces, publicSpaces, filterSpaces]);

    if (tabs.length === 0) {
        return null; // or some default view
    }

    const renderSearchAndFilters = () => {
        if (!showSearch && !showFilters) return null;
        
        return (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {showSearch && (
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search spaces..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                )}
                {showFilters && (
                    <div className="flex gap-2">
                        <Button
                            variant={visibilityFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setVisibilityFilter('all')}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            All
                        </Button>
                        <Button
                            variant={visibilityFilter === 'public' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setVisibilityFilter('public')}
                        >
                            <Globe className="mr-2 h-4 w-4" />
                            Public
                        </Button>
                        <Button
                            variant={visibilityFilter === 'private' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setVisibilityFilter('private')}
                        >
                            <Lock className="mr-2 h-4 w-4" />
                            Private
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    if (tabs.length === 1) {
        const tab = tabs[0];
        return (
            <div>
                {renderSearchAndFilters()}
                <SpacesGrid
                    spaces={tab.data}
                    isLoading={isLoading}
                    userId={userId}
                    owners={owners}
                    emptyStateMessage={tab.empty}
                />
            </div>
        )
    }

    return (
        <div>
            {renderSearchAndFilters()}
            <Tabs defaultValue={tabs[0].value}>
                <TabsList>
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
        </div>
    )
}
