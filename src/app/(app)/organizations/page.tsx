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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { organizations } from '@/lib/placeholder-data';
import { PlusCircle, Users2 } from 'lucide-react';
import Image from 'next/image';

export default function OrganizationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Collaborate with your teams and communities.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <Card key={org.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                 <Image
                    src={org.logoUrl}
                    alt={`${org.name} logo`}
                    width={56}
                    height={56}
                    className="rounded-lg border"
                  />
                <div>
                    <CardTitle>{org.name}</CardTitle>
                    <CardDescription>{org.memberCount} members</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex -space-x-2 overflow-hidden">
                {org.members.slice(0,5).map((member, index) => (
                  <Avatar key={index} className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {org.members.length > 5 && (
                    <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                        <AvatarFallback>+{org.members.length - 5}</AvatarFallback>
                    </Avatar>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/organizations/${org.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  <Users2 className="mr-2 h-4 w-4" />
                  Manage Organization
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
