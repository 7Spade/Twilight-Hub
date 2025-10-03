/**
 * @fileoverview A button component for starring or unstarring a space.
 * It displays a star icon that is filled when the space is starred and empty
 * otherwise. It handles the asynchronous logic of updating the star status
- * when clicked.
 */
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useStarActions } from '@/components/features/spaces/hooks/use-star-actions';

interface SpaceStarButtonProps {
  spaceId: string;
  userId?: string;
  isStarred: boolean;
  className?: string;
  onToggled?: (next: boolean) => void;
}

export function SpaceStarButton({
  spaceId,
  userId,
  isStarred,
  className,
  onToggled,
}: SpaceStarButtonProps) {
  const { toggleStar, isLoading } = useStarActions();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    const success = await toggleStar(spaceId, userId, isStarred);
    if (success) {
      onToggled?.(!isStarred);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200',
        isStarred
          ? 'text-yellow-500 hover:text-yellow-600 scale-110'
          : 'text-muted-foreground hover:text-yellow-500 hover:scale-110',
        className
      )}
    >
      <Star className={cn('h-5 w-5', isStarred && 'fill-current')} />
    </Button>
  );
}
