"use client";

import Link from "next/link";
import {
  Settings,
} from "lucide-react";
import React from "react";
import { Nav } from "./nav";
import { Logo } from "../logo";
import { cn } from "@/lib/utils";
import { TeamSwitcher, type Team } from "./team-switcher";


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
