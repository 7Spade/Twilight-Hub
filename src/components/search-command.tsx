/**
 * @fileoverview A global search command palette component.
 * It can be triggered by a button or a keyboard shortcut (Cmd+K/Ctrl+K).
 * It uses `cmdk` for the command menu UI and `use-debounce` to delay search queries.
 * It queries Firestore for users, organizations, and public spaces based on the search term.
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebounce } from 'use-debounce';
import {
  useFirestore,
  useCollection,
} from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Grid3x3, User, Users2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const router = useRouter();

  const firestore = useFirestore();

  const accountsQuery = useMemo(() => {
    if (!firestore || !debouncedSearchTerm) return null;
    return query(
      collection(firestore, 'accounts'),
      where('name', '>=', debouncedSearchTerm),
      where('name', '<=', debouncedSearchTerm + '\uf8ff'),
      limit(5)
    );
  }, [firestore, debouncedSearchTerm]);
  
  const spacesQuery = useMemo(() => {
      if (!firestore || !debouncedSearchTerm) return null;
      return query(
          collection(firestore, 'spaces'),
          where('name', '>=', debouncedSearchTerm),
          where('name', '<=', debouncedSearchTerm + '\uf8ff'),
          where('isPublic', '==', true),
          limit(5)
      )
  }, [firestore, debouncedSearchTerm]);


  const { data: accounts, isLoading: accountsLoading } = useCollection(accountsQuery);
  const { data: spaces, isLoading: spacesLoading } = useCollection(spacesQuery);


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const handleSelect = (path: string) => {
    runCommand(() => router.push(path));
  };
  
  const isLoading = accountsLoading || spacesLoading;

  return (
    <>
        <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground p-2 hover:text-foreground transition-colors"
        >
            <Search className="h-4 w-4" />
            <span>Search...</span>
             <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
            </kbd>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
            placeholder="Search for users, organizations, or spaces..."
            value={searchTerm}
            onValueChange={setSearchTerm}
        />
        <CommandList>
            {!isLoading && !accounts?.length && !spaces?.length && (
                <CommandEmpty>No results found.</CommandEmpty>
            )}
            
            {isLoading && <div className="p-4 text-sm text-center">Searching...</div>}
            
            {accounts && accounts.length > 0 && (
                <CommandGroup heading="People & Orgs">
                {accounts.map((account) => {
                    const path = account.type === 'user' ? `/${account.slug}` : `/organizations/${account.slug}`;
                    return (
                        <CommandItem
                            key={account.id}
                            onSelect={() => handleSelect(path)}
                            value={`${account.name}-${account.type}`}
                        >
                            {account.type === 'user' ? (
                                <User className="mr-2 h-4 w-4" />
                            ) : (
                                <Users2 className="mr-2 h-4 w-4" />
                            )}
                            <span>{account.name}</span>
                        </CommandItem>
                    )
                })}
                </CommandGroup>
            )}

            {spaces && spaces.length > 0 && (
                <CommandGroup heading="Spaces">
                {spaces.map((space) => (
                    <CommandItem
                        key={space.id}
                        onSelect={() => handleSelect(`/spaces/${space.slug}`)}
                         value={space.name}
                    >
                    <Grid3x3 className="mr-2 h-4 w-4" />
                    <span>{space.name}</span>
                    </CommandItem>
                ))}
                </CommandGroup>
            )}

        </CommandList>
        </CommandDialog>
    </>
  );
}
