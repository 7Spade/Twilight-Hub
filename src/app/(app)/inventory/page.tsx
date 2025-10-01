import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { modules, currentUser } from '@/lib/placeholder-data';
import { Package, Puzzle } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  default: Puzzle,
};

export default function InventoryPage() {
    const userModules = modules.filter(module => currentUser.inventory.includes(module.id));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Backpack</h1>
        <p className="text-muted-foreground">
          Here are the modules you&apos;ve collected from the Marketplace.
        </p>
      </div>

      {userModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userModules.map((module) => {
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
                  <Button className="w-full">Use in a Space</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
            <CardHeader>
                <div className="mx-auto bg-muted p-4 rounded-full mb-4">
                    <Backpack className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle>Your Backpack is Empty</CardTitle>
                <CardDescription>
                    Visit the Marketplace to discover and collect new modules for your spaces.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button>Go to Marketplace</Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
