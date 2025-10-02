'use client';

import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PageContainer } from '@/components/layout/page-container';
import Link from 'next/link';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Globe, User, Users2, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { type Account, type Space } from '@/lib/types';

const UserCard = ({ user }: { user: Account }) => (
  <Card>
    <CardHeader className="items-center">
      <Avatar className="h-20 w-20">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
      </Avatar>
    </CardHeader>
    <CardContent className="text-center">
      <CardTitle>{user.name}</CardTitle>
      <CardDescription>@{user.username}</CardDescription>
    </CardContent>
    <CardFooter>
      <Button asChild className="w-full" variant="outline">
        <Link href={`/${user.slug}`}>
          <User className="mr-2" /> View Profile
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

const OrgCard = ({ org, index }: { org: Account, index: number }) => {
    const logo = getPlaceholderImage(`org-logo-${(index % 3) + 1}`);
    return (
        <Card>
            <CardHeader className="items-center">
                <Image
                    src={logo.imageUrl}
                    alt={`${org.name} logo`}
                    width={80}
                    height={80}
                    className="rounded-lg border"
                    data-ai-hint={logo.imageHint}
                />
            </CardHeader>
            <CardContent className="text-center">
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>{org.memberIds?.length || 0} members</CardDescription>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full" variant="outline">
                    <Link href={`/organizations/${org.slug}`}>
                        <Users2 className="mr-2" /> View Organization
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

const SpaceCard = ({ space }: { space: Space }) => (
    <Card>
        <CardHeader>
            <CardTitle>{space.name}</CardTitle>
            <CardDescription className="line-clamp-2">{space.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Badge variant="secondary">
                <Globe className="mr-1 h-3 w-3" />
                Public
            </Badge>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full" variant="outline">
                {/* This assumes a generic space viewer page exists. 
                    We might need to adjust this URL structure later */}
                <Link href={`/spaces/${space.slug || space.id}`}>
                    Enter Space
                </Link>
            </Button>
        </CardFooter>
    </Card>
)

const DataGrid = <T,>({ data, isLoading, renderItem, emptyMessage }: {
    data: T[] | null,
    isLoading: boolean,
    renderItem: (item: T, index: number) => React.ReactNode;
    emptyMessage: string;
}) => {
  if (isLoading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((item, index) => renderItem(item, index))}
    </div>
  );
};

interface SearchableTabContentProps<T> {
    data: T[] | null;
    isLoading: boolean;
    renderItem: (item: T, index: number) => React.ReactNode;
    emptyMessage: string;
    searchPlaceholder: string;
}

const SearchableTabContent = <T extends { name: string }>({ data, isLoading, renderItem, emptyMessage, searchPlaceholder }: SearchableTabContentProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter((item) => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    return (
        <div>
            <div className="relative mb-8">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    className="pl-8 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <DataGrid<T>
                data={filteredData}
                isLoading={isLoading}
                renderItem={renderItem}
                emptyMessage={searchTerm ? 'No results found.' : emptyMessage}
            />
        </div>
    );
};


export default function DiscoverPage() {
  const firestore = useFirestore();

  const usersQuery = useMemo(() => (firestore ? query(collection(firestore, 'accounts'), where('type', '==', 'user')) : null), [firestore]);
  const { data: users, isLoading: usersLoading } = useCollection<Account>(usersQuery);

  const orgsQuery = useMemo(() => (firestore ? query(collection(firestore, 'accounts'), where('type', '==', 'organization')) : null), [firestore]);
  const { data: orgs, isLoading: orgsLoading } = useCollection<Account>(orgsQuery);

  const spacesQuery = useMemo(() => (firestore ? query(collection(firestore, 'spaces'), where('isPublic', '==', true)) : null), [firestore]);
  const { data: spaces, isLoading: spacesLoading } = useCollection<Space>(spacesQuery);


  return (
    <PageContainer
      title="Discover"
      description="Explore public profiles, organizations, and spaces on Twilight Hub."
    >
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="spaces">Spaces</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-6">
            <SearchableTabContent
                data={users}
                isLoading={usersLoading}
                renderItem={(user: Account) => <UserCard key={user.id} user={user} />}
                emptyMessage="No users found."
                searchPlaceholder="Search users..."
            />
        </TabsContent>
        <TabsContent value="organizations" className="mt-6">
            <SearchableTabContent
                data={orgs}
                isLoading={orgsLoading}
                renderItem={(org: Account, index: number) => <OrgCard key={org.id} org={org} index={index}/>}
                emptyMessage="No organizations found."
                searchPlaceholder="Search organizations..."
            />
        </TabsContent>
        <TabsContent value="spaces" className="mt-6">
            <SearchableTabContent
                data={spaces}
                isLoading={spacesLoading}
                renderItem={(space: Space) => <SpaceCard key={space.id} space={space} />}
                emptyMessage="No public spaces found."
                searchPlaceholder="Search spaces..."
            />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
