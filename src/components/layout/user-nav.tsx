'use client';

import React from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useFirebase } from '@/firebase/provider';
import { signOut } from 'firebase/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function UserNav() {
  const { user } = useAuth();
  const { auth } = useFirebase();

  const onLogout = async () => {
    await signOut(auth);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          {user?.email || 'Account'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href="/settings/profile">Profile</a>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}