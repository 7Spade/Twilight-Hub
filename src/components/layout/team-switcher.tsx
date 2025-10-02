'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { ChevronDown, User, Users } from 'lucide-react';

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
