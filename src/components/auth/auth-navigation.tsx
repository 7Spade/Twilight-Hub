'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { ArrowRight } from 'lucide-react';

export function AuthNavigation() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <Button asChild>
          <Link href="/dashboard">
            進入儀表板 <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <>
          <Button variant="ghost" asChild>
            <Link href="/login">登入</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              註冊 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}