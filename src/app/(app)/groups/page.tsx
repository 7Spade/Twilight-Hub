'use client';

import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { getPlaceholderImage } from '@/lib/placeholder-images';

function GroupCard({ groupId, organizationId }: { groupId: string; organizationId: string }) {
  const firestore = useFirestore();
  const groupDocRef = useMemo(
    () =>
      firestore
        ? doc(firestore, 'organizations', organizationId, 'groups', groupId)
        : null,
    [firestore, organizationId, groupId]
  );
  const { data: group, isLoading } = useDoc(groupDocRef);

  if (isLoading || !group) {
    return <div className="h-10 w-full rounded-md bg-muted animate-pulse"></div>;
  }

  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted rounded-md">
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="font-medium text-sm">{group.name}</p>
      </div>
      <span className="text-xs text-muted-foreground">{group.memberIds?.length || 0} members</span>
    </div>
  );
}

function OrganizationGroupsCard({ org }: { org: any }) {
  const firestore = useFirestore();
  const groupsQuery = useMemo(
    () => (firestore ? collection(firestore, 'organizations', org.id, 'groups') : null),
    [firestore, org.id]
  );
  const { data: groups, isLoading } = useCollection(groupsQuery);
  const logo = getPlaceholderImage(`org-logo-${(org.id.charCodeAt(0) % 3) + 1}`);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border">
            <AvatarImage src={logo.imageUrl} alt={org.name} />
            <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{org.name}</CardTitle>
            <CardDescription>{org.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
         <h4 className="text-sm font-medium text-muted-foreground">Groups in this organization</h4>
        {isLoading && <p className="text-sm">Loading groups...</p>}
        {groups && groups.length > 0 ? (
          <div className="space-y-1">
            {groups.map((group) => (
               <Link href={`/organizations/${org.slug}?tab=groups`} key={group.id} className="block">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{group.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{group.memberIds.length} Members</span>
                </div>
               </Link>
            ))}
          </div>
        ) : (
          !isLoading && <p className="text-sm text-muted-foreground text-center py-4">No groups in this organization yet.</p>
        )}
      </CardContent>
    </Card>
  );
}


export default function GroupsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const organizationsQuery = useMemo(
    () =>
      firestore && user
        ? query(collection(firestore, 'organizations'), where('memberIds', 'array-contains', user.uid))
        : null,
    [firestore, user]
  );
  const { data: organizations, isLoading } = useCollection(organizationsQuery);


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Groups</h1>
        <p className="text-muted-foreground">
          An overview of all groups across your organizations.
        </p>
      </div>

       {isLoading && <p>Loading your organizations...</p>}

       {!isLoading && organizations && organizations.length > 0 ? (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {organizations.map((org) => (
             <OrganizationGroupsCard key={org.id} org={org} />
           ))}
         </div>
       ) : (
        !isLoading && (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
                <CardHeader>
                    <div className="mx-auto bg-muted p-4 rounded-full mb-4">
                        <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardTitle>No Groups Found</CardTitle>
                    <CardDescription>
                        You are not a member of any groups yet. Join an organization to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/organizations">
                        <Button>Explore Organizations</Button>
                    </Link>
                </CardContent>
            </Card>
         )
       )}
    </div>
  );
}
