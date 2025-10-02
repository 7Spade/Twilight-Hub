'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Star, Globe, Lock } from 'lucide-react';
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';

import { useFirestore, useUser, useCollection } from '@/firebase';
import { useDialogStore } from '@/hooks/use-dialog-store';
import { PageContainer } from '@/components/layout/page-container';
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CreateSpaceDialog } from '@/components/create-space-dialog';

const SpaceCard = ({
  space,
  userId,
  orgSlug,
}: {
  space: any;
  userId: string | undefined;
  orgSlug: string;
}) => {
  const firestore = useFirestore();
  const isStarred = userId ? space.starredByUserIds?.includes(userId) : false;

  const handleStarClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firestore || !userId) return;
    const spaceRef = doc(firestore, 'spaces', space.id);
    await updateDoc(spaceRef, {
      starredByUserIds: isStarred ? arrayRemove(userId) : arrayUnion(userId),
    });
  };

  const spaceUrl = `/organizations/${orgSlug}/${space.slug}`;

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
                  'z-10',
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

export default function OrgSpacesPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const { user } = useUser();
  const firestore = useFirestore();
  const { open: openDialog } = useDialogStore();
  const [org, setOrg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      if (!firestore || !params.organizationslug) return;
      setIsLoading(true);
      const orgsRef = collection(firestore, 'organizations');
      const q = query(
        orgsRef,
        where('slug', '==', params.organizationslug),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orgDoc = querySnapshot.docs[0];
        setOrg({ id: orgDoc.id, ...orgDoc.data() });
      } else {
        setOrg(null);
      }
      setIsLoading(false);
    };

    fetchOrg();
  }, [firestore, params.organizationslug]);

  const spacesQuery = useMemo(
    () =>
      firestore && org
        ? query(collection(firestore, 'spaces'), where('ownerId', '==', org.id))
        : null,
    [firestore, org]
  );
  const { data: spaces, isLoading: spacesLoading } =
    useCollection(spacesQuery);

  const pageIsLoading = isLoading || spacesLoading;

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
            <BreadcrumbPage>Spaces</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageContainer
        title="Spaces"
        description={`Create and manage spaces for the ${org.name} organization.`}
      >
        <div className="flex justify-end mb-8">
          <Button onClick={() => openDialog('createSpace')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Space
          </Button>
        </div>
        
        {pageIsLoading ? (
            <p>Loading spaces...</p>
        ) : !spaces || spaces.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
                <p>No spaces found for this organization.</p>
            </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {spaces.map((space) => (
                    <SpaceCard
                    key={space.id}
                    space={space}
                    userId={user?.uid}
                    orgSlug={org.slug}
                    />
                ))}
            </div>
        )}
      </PageContainer>
    </div>
  );
}
