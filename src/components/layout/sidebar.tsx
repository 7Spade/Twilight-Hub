/**
 * @fileoverview The main desktop sidebar component for the application.
 * It houses the team/account switcher and the primary navigation.
 * The sidebar can be in an `expanded` or `collapsed` state, which is
 * controlled by its parent layout component.
 */

"use client";

import React from "react";
import Link from "next/link";
import {
  Settings,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { Logo } from "../logo";
import { Nav } from "./nav";
import { type NavItem } from "./navigation";
import { TeamSwitcher, type Team } from "./team-switcher";

export function Sidebar({
  isCollapsed,
  teams,
  selectedTeam,
  setSelectedTeam,
  navItems,
}: {
  isCollapsed: boolean;
  teams: Team[];
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team) => void;
  navItems: NavItem[];
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-[width] sm:duration-300",
        isCollapsed ? "w-14" : "w-56"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b transition-all lg:h-[60px]",
          isCollapsed ? "px-2 justify-center" : "px-4 lg:px-6"
        )}
      >
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo isCollapsed={isCollapsed} />
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <div className={cn("p-2 hidden sm:block", isCollapsed && "px-2")}>
          <TeamSwitcher
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            isCollapsed={isCollapsed}
          />
        </div>
        <Nav isCollapsed={isCollapsed} navItems={navItems} />
      </div>
    </aside>
  );
}
