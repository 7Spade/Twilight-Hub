"use client";

import Link from "next/link";
import {
  ChevronDown,
  Settings,
  User,
  Users
} from "lucide-react";
import React from "react";
import { type Team } from "@/app/(app)/layout";
import { Nav } from "./nav";
import { Logo } from "../logo";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

function TeamSwitcher({
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
                    {selectedTeam.isUser ? <User className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                    <span className="sr-only">{selectedTeam.label}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                 {teams.map((team) => (
                    <DropdownMenuItem key={team.id} onSelect={() => handleSelect(team)}>
                       <div className="flex items-center gap-2">
                          {team.isUser ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                          <span className="truncate">{team.label}</span>
                      </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
     )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
            <div className="flex items-center gap-2">
                {selectedTeam.isUser ? <User className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                <span className="truncate font-medium">{selectedTeam.label}</span>
            </div>
            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--sidebar-width)]" align="start">
        {teams.map((team) => (
          <DropdownMenuItem key={team.id} onSelect={() => handleSelect(team)}>
             <div className="flex items-center gap-2">
                {team.isUser ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                <span className="truncate">{team.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Sidebar({
    isCollapsed,
    teams,
    selectedTeam,
    setSelectedTeam,
}: {
    isCollapsed: boolean,
    teams: Team[],
    selectedTeam: Team | null,
    setSelectedTeam: (team: Team) => void,
}) {
  
  return (
    <aside className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-[width] sm:duration-300",
        isCollapsed ? "w-14" : "w-56"
      )}
      style={{'--sidebar-width': isCollapsed ? '3.5rem' : '14rem'} as React.CSSProperties}
      >
        <div className={cn(
          "flex h-14 items-center border-b lg:h-[60px] transition-all",
           isCollapsed ? "px-2 justify-center" : "px-4 lg:px-6"
        )}>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo isCollapsed={isCollapsed} />
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
            <div className={cn("px-3 py-2", isCollapsed && "px-2")}>
                <TeamSwitcher 
                    teams={teams} 
                    selectedTeam={selectedTeam} 
                    setSelectedTeam={setSelectedTeam}
                    isCollapsed={isCollapsed}
                />
            </div>
            <Nav isCollapsed={isCollapsed} selectedTeam={selectedTeam} />
        </div>

      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Link>
      </nav>
    </aside>
  );
}
