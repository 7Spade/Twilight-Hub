/**
 * @fileoverview A simple badge component that visually indicates whether a space is
 * public or private. It displays a "Public" or "Private" label along with a
 * corresponding icon (Globe or Lock), providing a quick visual cue for the
 * space's visibility status.
 */
'use client';

import { Globe, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function SpaceVisibilityBadge({ isPublic }: { isPublic: boolean }) {
  return (
    <Badge 
      variant={isPublic ? 'secondary' : 'outline'}
      className={cn(
        'transition-colors duration-200',
        isPublic 
          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      )}
    >
      {isPublic ? (
        <Globe className="mr-1 h-3 w-3" />
      ) : (
        <Lock className="mr-1 h-3 w-3" />
      )}
      {isPublic ? 'Public' : 'Private'}
    </Badge>
  );
}
