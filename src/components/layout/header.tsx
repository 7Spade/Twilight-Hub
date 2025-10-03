'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { UserNav } from './user-nav';

export function Header() {
  return (
    <header className={cn('flex h-14 items-center border-b px-4 lg:px-6')}>
      <div className="ml-auto">
        <UserNav />
      </div>
    </header>
  );
}