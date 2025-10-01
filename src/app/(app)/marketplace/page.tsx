import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { modules } from '@/lib/placeholder-data';
import { PackagePlus, Puzzle, Search } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  default: Puzzle,
};

export default function MarketplacePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">
            Discover modules to enhance your spaces.
          </p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search modules..."
            className="pl-8 w-full md:w-[250px] lg:w-[300px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module) => {
          const Icon = iconMap[module.icon] || iconMap.default;
          return (
            <Card key={module.id} className="flex flex-col">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <div className="p-3 bg-muted rounded-lg">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle>{module.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {module.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Add to Backpack
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
