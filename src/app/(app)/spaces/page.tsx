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
import { Badge } from '@/components/ui/badge';
import { spaces } from '@/lib/placeholder-data';
import { PlusCircle, Star, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function SpacesPage() {
  const yourSpaces = spaces.slice(0, 4);
  const starredSpaces = spaces.filter(s => s.isStarred);
  const publicSpaces = spaces.filter(s => s.isPublic);

  const SpaceCard = ({ space }: { space: typeof spaces[0] }) => (
    <Card key={space.id} className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{space.name}</CardTitle>
                <CardDescription>{space.description}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className={cn(space.isStarred ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400')}>
                <Star className={cn(space.isStarred && 'fill-current')} />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Badge variant={space.isPublic ? 'secondary' : 'outline'}>
          {space.isPublic ? <Globe className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
          {space.isPublic ? 'Public' : 'Private'}
        </Badge>
      </CardContent>
      <CardFooter>
        <Link href={`/spaces/${space.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Enter Space
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spaces</h1>
          <p className="text-muted-foreground">
            Build and customize your personal or team environments.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Space
        </Button>
      </div>

       <Tabs defaultValue="yours">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="yours">Your Spaces</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>
        <TabsContent value="yours" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {yourSpaces.map(space => <SpaceCard key={space.id} space={space} />)}
            </div>
        </TabsContent>
        <TabsContent value="starred" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {starredSpaces.map(space => <SpaceCard key={space.id} space={space} />)}
            </div>
        </TabsContent>
        <TabsContent value="discover" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {publicSpaces.map(space => <SpaceCard key={space.id} space={space} />)}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
