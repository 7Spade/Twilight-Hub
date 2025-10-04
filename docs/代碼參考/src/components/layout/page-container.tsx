/**
 * @fileoverview A standard container for page content.
 * It provides a consistent layout structure with a main title (h1)
 * and an optional description, followed by the page's main content.
 * This helps maintain visual consistency across different pages.
 */

'use client';

import { cn } from '@/lib/utils';

type PageContainerProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({
  title,
  description,
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
