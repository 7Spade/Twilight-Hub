/**
 * @fileoverview A skeleton loader component for the `FormCard`.
 * It provides a visual placeholder that mimics the layout of the FormCard,
 * including its header, content inputs, and footer button, to be displayed
 * while form data is being loaded.
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function FormCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-lg border p-4" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}
