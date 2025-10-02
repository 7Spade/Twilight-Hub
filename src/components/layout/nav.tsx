
'use client';

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Store,
  Users2,
  Settings,
  Grid3x3,
  MessageSquare,
  Bell,
  Package,
} from "lucide-react";
import React, { useMemo } from "react";
import { type Team } from "@/app/(app)/layout";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";

const NavLink = ({
    href,
    icon: Icon,
    label,
    isCollapsed,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    isCollapsed: boolean;
}) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

    if (isCollapsed) {
        return (
            <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                          isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <Link
            href={href}
            className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-primary",
                isActive && "bg-muted text-primary"
            )}
        >
            <Icon className="h-4 w-4" />
            <span className="group-data-[state=collapsed]:hidden">{label}</span>
        </Link>
    )
}

export function Nav({
    isCollapsed,
    selectedTeam,
}: {
    isCollapsed: boolean;
    selectedTeam: Team | null;
}) {

 const navItems = useMemo(() => {
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
            { href: `/organizations/${orgSlug}/inventory`, icon: Package, label: 'Inventory' },
            { href: `/organizations/${orgSlug}/groups`, icon: Users2, label: 'Groups' },
            { href: `/organizations/${orgSlug}/members`, icon: Users2, label: 'Members' },
            { href: `/organizations/${orgSlug}/settings`, icon: Settings, label: 'Settings' },
        ];
    }
  }, [selectedTeam]);

  return (
    <nav 
        data-state={isCollapsed ? 'collapsed' : 'expanded'} 
        className={cn("grid items-start gap-1 group", isCollapsed ? "px-2" : "px-4")}
    >
       {navItems.map((item) => (
            <NavLink key={item.label} {...item} isCollapsed={isCollapsed}/>
        ))}
    </nav>
  )
}
