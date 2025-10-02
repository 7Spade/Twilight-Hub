'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MoreVertical, PlusCircle, UserPlus } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useDoc, useCollection, useFirestore } from '@/firebase';
import { collection, doc, query, updateDoc, where, getDocs, limit } from 'firebase/firestore';
import React, { useMemo, useEffect, useState } from 'react';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { AuditLogList } from '@/components/audit-log-list';
import { useDialogStore } from '@/hooks/use-dialog-store';
import { CreateGroupDialog } from '@/components/create-group-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormCard } from '@/components/forms/form-card';

function MemberRow({ userId }: { userId: string }) {
    const firestore = useFirestore();
    const userDocRef = useMemo(() => (firestore ? doc(firestore, 'users', userId) : null), [firestore, userId]);
    const { data: user, isLoading } = useDoc(userDocRef);

    if (isLoading || !user) {
        return <TableRow><TableCell colSpan={3}>Loading member...</TableCell></TableRow>;
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
                        <p className="text-sm text-muted-foreground">
                            {user.email}
                        </p>
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
                        <DropdownMenuItem className="text-destructive">
                            Remove
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}


function GroupCard({ groupId, organizationId }: { groupId: string, organizationId: string }) {
    const firestore = useFirestore();
    const groupDocRef = useMemo(() => (firestore ? doc(firestore, 'organizations', organizationId, 'groups', groupId) : null), [firestore, organizationId, groupId]);
    const { data: group, isLoading } = useDoc(groupDocRef);

    if (isLoading || !group) {
        return <Card><CardContent className="p-6">Loading group...</CardContent></Card>;
    }

    return (
         <Card key={group.id}>
            <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.memberIds?.length || 0} members</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex -space-x-2 overflow-hidden">
                    {(group.memberIds || []).slice(0,5).map((id: string, index: number) => (
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
    )
}

const orgSettingsSchema = z.object({
  name: z.string().min(1, { message: 'Organization name cannot be empty.' }),
  description: z.string().min(1, { message: 'Description cannot be empty.' }),
});

type OrgSettingsFormValues = z.infer<typeof orgSettingsSchema>;

function OrganizationSettings({ organization }: { organization: any }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<OrgSettingsFormValues>({
    resolver: zodResolver(orgSettingsSchema),
    defaultValues: {
      name: organization?.name || '',
      description: organization?.description || '',
    },
  });
  
  useEffect(() => {
    if (organization) {
        form.reset({
            name: organization.name || '',
            description: organization.description || '',
        });
    }
  }, [organization, form]);

  const onSubmit = async (data: OrgSettingsFormValues) => {
    if (!firestore || !organization) return;

    const orgRef = doc(firestore, 'organizations', organization.id);
    try {
      await updateDoc(orgRef, {
        name: data.name,
        description: data.description,
      });
      toast({
        title: 'Success',
        description: 'Organization details have been updated.',
      });
    } catch (error) {
      console.error('Failed to update organization', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update organization details.',
      });
    }
  };

  return (
    <FormCard
      title="Organization Settings"
      description="Update your organization's details."
      isLoading={!organization}
      form={form}
      onSubmit={onSubmit}
    >
      <FormInput
          control={form.control}
          name="name"
          label="Organization Name"
          placeholder="Your organization's name"
      />
      <FormTextarea
          control={form.control}
          name="description"
          label="Description"
          placeholder="A short description of your organization."
      />
    </FormCard>
  );
}

export default function OrganizationDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';
  
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

  const groupsQuery = useMemo(() => (firestore && org ? collection(firestore, 'organizations', org.id, 'groups') : null), [firestore, org]);
  const { data: groups, isLoading: groupsLoading } = useCollection(groupsQuery);


  if (isLoading) {
    return <div>Loading organization...</div>;
  }

  if (!org) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <CreateGroupDialog organizationId={org.id} />
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
                <p className="text-muted-foreground">{org.memberIds?.length || 0} members</p>
            </div>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </div>

      <Tabs defaultValue={tab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="audit-log">Audit Log</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
         <TabsContent value="overview">
             <Card>
                <CardHeader>
                    <CardTitle>Welcome to {org.name}</CardTitle>
                    <CardDescription>This is your organization's central hub.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Use the tabs to navigate through different sections of your organization.</p>
                </CardContent>
             </Card>
        </TabsContent>
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Manage who is part of your organization.
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
        </TabsContent>
        <TabsContent value="groups">
          <Card>
             <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Groups</CardTitle>
                    <CardDescription>Organize members into smaller teams.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => openDialog('createGroup')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Group
                </Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                {groupsLoading && <p>Loading groups...</p>}
                {groups && groups.map(group => (
                    <GroupCard key={group.id} groupId={group.id} organizationId={org.id} />
                ))}
                 {!groupsLoading && (!groups || groups.length === 0) && (
                    <p className="text-muted-foreground col-span-full text-center py-8">No groups created yet.</p>
                )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
                <CardDescription>A summary of your organization's items and warehouses.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Inventory summary will be displayed here. For detailed management, go to the full inventory page.</p>
            </CardContent>
            <CardFooter>
                 <Link href={`/organizations/${org.slug}/inventory`}>
                    <Button variant="outline">Go to Inventory Management</Button>
                </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="audit-log">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>
                See all actions that have taken place in this organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLogList organizationId={org.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <OrganizationSettings organization={org} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
