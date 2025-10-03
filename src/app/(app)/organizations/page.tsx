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
import {
  useCollection,
  useFirestore,
  useUser,
} from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { PlusCircle, Users2 } from 'lucide-react';
import Image from 'next/image';
import { useDialogState } from '@/hooks/use-app-state';
import { useMemo } from 'react';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { PageContainer } from '@/components/layout/page-container';

function OrganizationCard({
  org,
  index,
}: {
  org: {
    id: string;
    name: string;
    description: string;
    memberIds: string[];
    slug: string;
  };
  index: number;
}) {
  const logo = getPlaceholderImage(`org-logo-${(index % 3) + 1}`);
  return (
    <Card key={org.id} className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Image
            src={logo.imageUrl}
            alt={`${org.name} logo`}
            width={56}
            height={56}
            className="rounded-lg border"
            data-ai-hint={logo.imageHint}
          />
          <div>
            <CardTitle>{org.name}</CardTitle>
            <CardDescription>{org.memberIds?.length || 0} members</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{org.description}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/organizations/${org.slug}`} className="w-full">
          <Button variant="outline" className="w-full">
            <Users2 className="mr-2 h-4 w-4" />
            Manage Organization
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function OrganizationsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { open: openDialog } = useDialogState();

  const organizationsQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, 'accounts'), where('type', '==', 'organization'), where('memberIds', 'array-contains', user.uid)) : null),
    [firestore, user]
  );
  const { data: organizations, isLoading } = useCollection(organizationsQuery);

  return (
    <PageContainer
        title="Organizations"
        description="Collaborate with your teams and communities."
    >
        <div className="flex justify-end mb-8">
            <Button onClick={() => openDialog('createOrganization')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Organization
            </Button>
        </div>

        {isLoading && <p>Loading organizations...</p>}

        {!isLoading && organizations && organizations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org, index) => (
                <OrganizationCard
                key={org.id}
                org={org as { id: string; name: string; description: string; memberIds: string[]; slug: string; }}
                index={index}
                />
            ))}
            </div>
        )}
        {!isLoading && (!organizations || organizations.length === 0) && (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
            <CardHeader>
                <div className="mx-auto bg-muted p-4 rounded-full mb-4">
                <Users2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle>No Organizations Found</CardTitle>
                <CardDescription>
                Get started by creating a new organization.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => openDialog('createOrganization')}>
                Create Organization
                </Button>
            </CardContent>
            </Card>
        )}
    </PageContainer>
  );
}
