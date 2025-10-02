"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Settings,
  LayoutDashboard,
  Store,
  Users2,
  Grid3x3,
  Package,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { Logo } from "../logo";
import { Nav, type NavItem } from "./nav";
import { TeamSwitcher, type Team } from "./team-switcher";

export function Sidebar({
  isCollapsed,
  teams,
  selectedTeam,
  setSelectedTeam,
}: {
  isCollapsed: boolean;
  teams: Team[];
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team) => void;
}) {
  const navItems = useMemo((): NavItem[] => {
    if (!selectedTeam) return [];

    if (selectedTeam.isUser) {
      return [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/spaces', icon: Grid3x3, label: 'Spaces' },
        { href: '/marketplace', icon: Store, label: 'Marketplace' },
        { href: '/organizations', icon: Users2, label: 'Organizations' },
      ];
    } else {
      const orgSlug = selectedTeam.slug;
      return [
        { href: `/organizations/${orgSlug}`, icon: LayoutDashboard, label: 'Overview' },
        { href: `/organizations/${orgSlug}?tab=groups`, icon: Users2, label: 'Groups' },
        { href: `/organizations/${orgSlug}/inventory`, icon: Package, label: 'Inventory' },
        { href: `/organizations/${orgSlug}/settings`, icon: Settings, label: 'Settings' },
      ];
    }
  }, [selectedTeam]);

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
        <div className={cn("px-3 py-2", isCollapsed && "px-2")}>
          <TeamSwitcher
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            isCollapsed={isCollapsed}
          />
        </div>
        <Nav isCollapsed={isCollapsed} navItems={navItems} />
      </div>

      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  isCollapsed ? "" : "w-full justify-start gap-3 px-3"
                )}
              >
                <Settings className="h-5 w-5" />
                <span className={cn(isCollapsed && "sr-only")}>Settings</span>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Settings</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
