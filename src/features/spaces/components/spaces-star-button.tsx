'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';

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
  const firestore = useFirestore();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firestore || !userId) return;
    const spaceRef = doc(firestore, 'spaces', spaceId);
    await updateDoc(spaceRef, {
      starredByUserIds: isStarred ? arrayRemove(userId) : arrayUnion(userId),
    });
    onToggled?.(!isStarred);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
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


