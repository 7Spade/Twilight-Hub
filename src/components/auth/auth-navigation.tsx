'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/auth-provider';
import { ArrowRight } from 'lucide-react';

export function AuthNavigation() {
  const { isAuthenticated, isUserLoading } = useAuth();

  if (isUserLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <Button asChild>
          <Link href="/dashboard">
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <>
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
