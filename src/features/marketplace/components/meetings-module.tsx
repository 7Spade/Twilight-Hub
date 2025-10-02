/**
 * @fileoverview A placeholder component for a future "Meetings" module.
 * It displays a message indicating that the feature is under construction,
 * providing a clear visual cue to the user about planned functionality.
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Wrench } from 'lucide-react';

export function MeetingsModule() {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-4">
            <Video className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle>會議記錄 (Meeting Notes)</CardTitle>
        <CardDescription>
          This feature is currently under construction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Soon you'll be able to manage meeting agendas, notes, and track action items right here.
        </p>
        <Button disabled>
            <Wrench className="mr-2 h-4 w-4" />
            Coming Soon
        </Button>
      </CardContent>
    </Card>
  );
}
