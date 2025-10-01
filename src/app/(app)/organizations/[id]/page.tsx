import Link from 'next/link';
import Image from 'next/image';
import {
  MoreVertical,
  PlusCircle,
  UserPlus,
} from 'lucide-react';
import { organizations } from '@/lib/placeholder-data';
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

export default function OrganizationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const org = organizations.find((o) => o.id === params.id);

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
                src={org.logoUrl}
                alt={`${org.name} logo`}
                width={64}
                height={64}
                className="rounded-lg border"
            />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
                <p className="text-muted-foreground">{org.memberCount} members</p>
            </div>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
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
                  {org.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>{member.role}</Badge>
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
                <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Group
                </Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                {org.groups.map(group => (
                    <Card key={group.id}>
                        <CardHeader>
                            <CardTitle>{group.name}</CardTitle>
                            <CardDescription>{group.memberCount} members</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex -space-x-2 overflow-hidden">
                                {group.members.slice(0,5).map((member, index) => (
                                <Avatar key={index} className="inline-block h-8 w-8 rounded-full ring-2 ring-card">
                                    <AvatarImage src={member.avatarUrl} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                ))}
                                {group.members.length > 5 && (
                                    <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-card">
                                        <AvatarFallback>+{group.members.length - 5}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Update your organization's details.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Settings form would be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
