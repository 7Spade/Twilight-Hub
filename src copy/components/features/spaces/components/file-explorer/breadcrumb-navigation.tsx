/**
 * @fileoverview A breadcrumb navigation component for the file explorer.
 * It displays the current path within the folder structure and allows users to
 * navigate back to parent directories by clicking on the breadcrumb items.
 */
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  id: string;
  name: string;
  path?: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  onItemClick: (item: BreadcrumbItem) => void;
  className?: string;
}

export function BreadcrumbNavigation({ 
  items, 
  onItemClick, 
  className 
}: BreadcrumbNavigationProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {/* 首頁 */}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-muted"
        onClick={() => onItemClick({ id: 'root', name: '首頁' })}
      >
        <Home className="h-3 w-3" />
      </Button>

      {/* 麵包屑 */}
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 px-2 text-sm font-normal hover:bg-muted",
              index === items.length - 1 && "text-foreground font-medium"
            )}
            onClick={() => onItemClick(item)}
          >
            {item.name}
          </Button>
        </React.Fragment>
      ))}
    </nav>
  );
}
