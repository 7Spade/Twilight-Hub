'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  return (
    <nav className="p-2">
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.title}
              asChild
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                isCollapsed ? 'px-2' : 'px-3',
                isActive && 'bg-accent text-accent-foreground'
              )}
            >
              <Link href={item.href}>
                <Icon className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
                {!isCollapsed && item.title}
                {isCollapsed && <span className="sr-only">{item.title}</span>}
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}