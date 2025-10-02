'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, User, Users, Settings, PlusCircle } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useDialogStore } from '@/hooks/use-dialog-store';
import { cn } from '@/lib/utils';

export type Team = {
  id: string;
  label: string;
  isUser: boolean;
  slug?: string;
};

export function TeamSwitcher({
  teams,
  selectedTeam,
  setSelectedTeam,
  isCollapsed,
}: {
  teams: Team[];
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team) => void;
  isCollapsed: boolean;
}) {
  const { open: openDialog } = useDialogStore();

  const handleSelect = (team: Team) => {
    setSelectedTeam(team);
  };

  if (!selectedTeam) return null;

  if (isCollapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            {selectedTeam.isUser ? (
              <User className="h-5 w-5" />
            ) : (
              <Users className="h-5 w-5" />
            )}
            <span className="sr-only">{selectedTeam.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          {teams.map((team) => (
            <DropdownMenuItem key={team.id} onSelect={() => handleSelect(team)}>
              <div className="flex items-center gap-2">
                {team.isUser ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                <span className="truncate">{team.label}</span>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          {selectedTeam && !selectedTeam.isUser && (
            <DropdownMenuItem asChild>
              <Link href={`/organizations/${selectedTeam.slug}`}>
                <Settings className="mr-2 h-4 w-4" />
                Manage Organization
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => openDialog('createOrganization')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
          <div className="flex items-center gap-2">
            {selectedTeam.isUser ? (
              <User className="h-5 w-5" />
            ) : (
              <Users className="h-5 w-5" />
            )}
            <span className="truncate font-medium">{selectedTeam.label}</span>
          </div>
          <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--sidebar-width)]" align="start">
        {teams.map((team) => (
          <DropdownMenuItem key={team.id} onSelect={() => handleSelect(team)}>
            <div className="flex items-center gap-2">
              {team.isUser ? (
                <User className="h-4 w-4" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              <span className="truncate">{team.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {selectedTeam && !selectedTeam.isUser && (
          <DropdownMenuItem asChild>
            <Link href={`/organizations/${selectedTeam.slug}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Manage Organization
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => openDialog('createOrganization')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
