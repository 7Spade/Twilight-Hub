'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { NavItem } from './navigation';

export function Nav({
  isCollapsed,
  navItems,
}: {
  isCollapsed: boolean;
  navItems: NavItem[];
}) {
  return (
    <nav className="p-2">
      <div className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.title}
            asChild
            variant={item.isActive ? 'secondary' : 'ghost'}
            className={cn('w-full justify-start', isCollapsed ? 'px-2' : 'px-3')}
          >
            <Link href={item.href}>
              {!isCollapsed && item.title}
              {isCollapsed && <span className="sr-only">{item.title}</span>}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}