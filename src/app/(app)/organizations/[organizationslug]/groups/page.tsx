'use client';

import React, { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { collection, doc, query, where, getDocs, limit } from 'firebase/firestore';

import { useDoc, useCollection, useFirestore } from '@/firebase';
import { useDialogState } from '@/hooks/use-app-state';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { PageContainer } from '@/components/layout/page-container';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { type Account, type Group } from '@/lib/types';


function GroupCard({ groupId, organizationId }: { groupId: string; organizationId: string }) {
  const firestore = useFirestore();
  const groupDocRef = useMemo(
    () => (firestore ? doc(firestore, 'accounts', organizationId, 'groups', groupId) : null),
    [firestore, organizationId, groupId]
  );
  const { data: groupData, isLoading } = useDoc<Group>(groupDocRef);
  const group = groupData;

  if (isLoading || !group) {
    return (
      <Card>
        <CardContent className="p-6">Loading group...</CardContent>
      </Card>
    );
  }

  return (
    <Card key={group.id}>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
        <CardDescription>{group.memberIds?.length || 0} members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex -space-x-2 overflow-hidden">
          {(group.memberIds || []).slice(0, 5).map((id: string, index: number) => (
            <Avatar key={id} className="inline-block h-8 w-8 rounded-full ring-2 ring-card">
              <AvatarImage src={getPlaceholderImage(`avatar-${(index % 6) + 1}`).imageUrl} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          ))}
          {group.memberIds && group.memberIds.length > 5 && (
            <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-card">
              <AvatarFallback>+{group.memberIds.length - 5}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function GroupsPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const firestore = useFirestore();
  const { open: openDialog } = useDialogState();
  const [org, setOrg] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      if (!firestore || !params.organizationslug) return;
      setIsLoading(true);
      const orgsRef = collection(firestore, 'accounts');
      const q = query(orgsRef, where('slug', '==', params.organizationslug), where('type', '==', 'organization'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orgDoc = querySnapshot.docs[0];
        setOrg({ id: orgDoc.id, ...orgDoc.data() } as Account);
      } else {
        setOrg(null);
      }
      setIsLoading(false);
    };

    fetchOrg();
  }, [firestore, params.organizationslug]);

  const groupsQuery = useMemo(
    () => (firestore && org ? collection(firestore, 'accounts', org.id, 'groups') : null),
    [firestore, org]
  );
  const { data: groupsData, isLoading: groupsLoading } = useCollection<Group>(groupsQuery);
  const groups = groupsData || [];
  
  if (isLoading) {
    return <div>Loading organization...</div>;
  }

  if (!org) {
    return <div>Organization not found</div>;
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
              <Link href="/organizations">Organizations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
             <BreadcrumbLink asChild>
              <Link href={`/organizations/${org.slug}`}>{org.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Groups</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageContainer
        title="Groups"
        description={`Organize members into smaller teams within ${org.name}.`}
      >
        <div className="flex justify-end mb-8">
            <Button variant="outline" onClick={() => openDialog('createGroup')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Group
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groupsLoading && <p>Loading groups...</p>}
          {groups.map((group) => (
            <GroupCard key={group.id} groupId={group.id} organizationId={org.id} />
          ))}
          {!groupsLoading && groups.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-8">
              No groups created yet.
            </p>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
