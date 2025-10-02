'use client';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  Backpack,
  Grid3x3,
  Star,
  Users2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useMemo } from 'react';
import { PageContainer } from '@/components/layout/page-container';

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userOrganizationsQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, 'accounts'), where('type', '==', 'organization'), where('memberIds', 'array-contains', user.uid)) : null),
    [firestore, user]
  );
  const { data: organizations, isLoading: orgsLoading } = useCollection(userOrganizationsQuery);

  const userSpacesQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, 'accounts', user.uid, 'spaces')) : null),
    [firestore, user]
  );
  const { data: spaces, isLoading: spacesLoading } = useCollection(userSpacesQuery);
  
  const starredSpacesQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, 'spaces'), where('starredByUserIds', 'array-contains', user.uid), limit(3)) : null),
    [firestore, user]
  );
  const { data: starredSpaces, isLoading: starredSpacesLoading } = useCollection(starredSpacesQuery);


  if (isUserLoading || orgsLoading || spacesLoading || starredSpacesLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in.</div>;
  }
  
  const displayName = user.displayName || 'User';

  return (
    <PageContainer
        title={`Welcome back, ${displayName}!`}
        description="Here's a quick overview of your hub."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              You are a member of {organizations?.length || 0} orgs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Spaces</CardTitle>
            <Grid3x3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spaces?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              You own {spaces?.length || 0} spaces
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Backpack className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Modules in your backpack
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total followers on the platform
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Catch up on what&apos;s been happening in your network.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="text-center py-10 text-muted-foreground">
                No recent activity.
               </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Starred Spaces</CardTitle>
            <CardDescription>Your favorite and most visited spaces.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
                {starredSpaces && starredSpaces.map((space) => (
                    <div key={space.id} className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-md">
                            <Star className="h-6 w-6 text-yellow-500 fill-yellow-400" />
                        </div>
                        <div className="grid gap-1 flex-1">
                            <p className="text-sm font-medium leading-none">{space.name}</p>
                            <p className="text-sm text-muted-foreground">{space.description}</p>
                        </div>
                        <Link href={`/spaces/${space.slug}`}>
                            <Button variant="outline" size="sm">View</Button>
                        </Link>
                    </div>
                ))}
                {(!starredSpaces || starredSpaces.length === 0) && <p className="text-sm text-muted-foreground">You haven&apos;t starred any spaces yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
