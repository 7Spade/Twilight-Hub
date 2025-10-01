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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { currentUser, organizations, spaces, notifications } from '@/lib/placeholder-data';

export default function Dashboard() {
  const starredSpaces = spaces.filter(space => space.isStarred).slice(0, 3);
  const userOrganizations = organizations.slice(0, 2);
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a quick overview of your hub.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">
              You are a member of {organizations.length} orgs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Spaces</CardTitle>
            <Grid3x3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spaces.length}</div>
            <p className="text-xs text-muted-foreground">
              + {spaces.filter(s => s.isPublic).length} public spaces
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Backpack className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser.inventory.length}</div>
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
            <div className="text-2xl font-bold">+{currentUser.followers}</div>
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
                {recentNotifications.map((notification) => (
                    <div className="flex items-start gap-4" key={notification.id}>
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src={notification.user.avatarUrl} alt="Avatar" />
                            <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">
                            {notification.user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            {notification.text}
                            </p>
                        </div>
                         <p className="ml-auto text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                ))}
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
                {starredSpaces.map((space) => (
                    <div key={space.id} className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-md">
                            <Star className="h-6 w-6 text-yellow-500 fill-yellow-400" />
                        </div>
                        <div className="grid gap-1 flex-1">
                            <p className="text-sm font-medium leading-none">{space.name}</p>
                            <p className="text-sm text-muted-foreground">{space.description}</p>
                        </div>
                        <Link href={`/spaces/${space.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                        </Link>
                    </div>
                ))}
                {starredSpaces.length === 0 && <p className="text-sm text-muted-foreground">You haven't starred any spaces yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
