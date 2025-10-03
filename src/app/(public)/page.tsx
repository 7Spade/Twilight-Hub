'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/auth-provider';

export default function PublicHomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-semibold">Twilight Hub</h1>
        <p className="text-sm text-muted-foreground">Collaborate, organize, and manage your workspaces.</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}