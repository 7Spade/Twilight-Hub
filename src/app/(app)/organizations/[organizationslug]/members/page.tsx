'use client';

import React, { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { MoreVertical, UserPlus } from 'lucide-react';
import { collection, doc, query, where, getDocs, limit } from 'firebase/firestore';

import { useDoc, useFirestore } from '@/firebase';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDialogStore } from '@/hooks/use-dialog-store';

function MemberRow({ userId }: { userId: string }) {
  const firestore = useFirestore();
  const userDocRef = useMemo(
    () => (firestore ? doc(firestore, 'users', userId) : null),
    [firestore, userId]
  );
  const { data: user, isLoading } = useDoc(userDocRef);

  if (isLoading || !user) {
    return (
      <TableRow>
        <TableCell colSpan={3}>Loading member...</TableCell>
      </TableRow>
    );
  }

  const role = 'Member';

  return (
    <TableRow key={user.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatarUrl || getPlaceholderImage('avatar-1').imageUrl} />
            <AvatarFallback>{user.name ? user.name[0] : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={role === 'Admin' ? 'default' : 'secondary'}>{role}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit Role</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default function MembersPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const firestore = useFirestore();
  const { open: openDialog } = useDialogStore();
  const [org, setOrg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      if (!firestore || !params.organizationslug) return;
      setIsLoading(true);
      const orgsRef = collection(firestore, 'organizations');
      const q = query(orgsRef, where('slug', '==', params.organizationslug), limit(1));
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
            <BreadcrumbPage>Members</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageContainer
        title="Members"
        description={`Manage who is part of ${org.name}.`}
      >
        <div className="flex justify-end mb-8">
            <Button onClick={() => openDialog('inviteMember')}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Member List</CardTitle>
            <CardDescription>
              A list of all users in this organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {org.memberIds?.map((memberId: string) => (
                  <MemberRow key={memberId} userId={memberId} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}
