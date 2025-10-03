'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, Settings, Package, Users2, ScrollText, Group } from 'lucide-react';
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { PageContainer } from '@/components/layout/page-container';
import { Skeleton } from '@/components/ui/skeleton';
import { type Account, type Group as GroupType, type Item } from '@/lib/types-unified';

function StatCard({
  title,
  value,
  icon: Icon,
  link,
  linkText
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  link: string;
  linkText: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Button variant="link" asChild className="p-0 h-auto mt-1">
          <Link href={link}>
            {linkText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function OrganizationDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string }>;
}) {
  const params = React.use(paramsPromise);

  const firestore = useFirestore();
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
  const { data: groupsData, isLoading: groupsLoading } = useCollection<GroupType>(groupsQuery);
  const groups = groupsData || [];
  
  const itemsQuery = useMemo(
    () => (firestore && org ? collection(firestore, 'accounts', org.id, 'items') : null),
    [firestore, org]
  );
  const { data: itemsData, isLoading: itemsLoading } = useCollection<Item>(itemsQuery);
  const items = itemsData || [];

  if (isLoading) {
    return (
        <div className="flex flex-col gap-8">
            <Skeleton className="h-5 w-1/2" />
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-12" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-12" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-12" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-12" /></CardContent></Card>
            </div>
        </div>
    )
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
            <BreadcrumbPage>{org.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={getPlaceholderImage('org-logo-1').imageUrl}
            alt={`${org.name} logo`}
            width={64}
            height={64}
            className="rounded-lg border"
            data-ai-hint={getPlaceholderImage('org-logo-1').imageHint}
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
            <p className="text-muted-foreground">{org.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Members
            </Button>
             <Button variant="outline" asChild>
                <Link href={`/organizations/${org.slug}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </Link>
            </Button>
        </div>
      </div>
      
      <PageContainer title="Overview" description="A high-level summary of your organization's status.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Members"
                value={org.memberIds?.length || 0}
                icon={Users2}
                link={`/organizations/${org.slug}/members`}
                linkText="Manage members"
            />
             <StatCard 
                title="Groups"
                value={groupsLoading ? '...' : groups.length}
                icon={Group}
                link={`/organizations/${org.slug}/groups`}
                linkText="Manage groups"
            />
            <StatCard 
                title="Inventory Items"
                value={itemsLoading ? '...' : items.length}
                icon={Package}
                link={`/organizations/${org.slug}/inventory`}
                linkText="Manage inventory"
            />
             <StatCard 
                title="Recent Actions"
                value={'0'}
                icon={ScrollText}
                link={`/organizations/${org.slug}/audit-log`}
                linkText="View audit log"
            />
        </div>
      </PageContainer>

    </div>
  );
}
