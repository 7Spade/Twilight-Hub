'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Wrench } from 'lucide-react';

export function IssuesPlaceholder() {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-4">
            <ClipboardList className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle>Issues Tracking</CardTitle>
        <CardDescription>
          This feature is currently under construction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Soon you'll be able to track tasks, bugs, and other issues right here within your spaces.
        </p>
        <Button disabled>
            <Wrench className="mr-2 h-4 w-4" />
            Coming Soon
        </Button>
      </CardContent>
    </Card>
  );
}
