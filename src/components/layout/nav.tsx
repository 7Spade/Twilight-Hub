
'use client';

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavItem = {
    href: string;
    icon: React.ElementType;
    label: string;
};

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
    // More robust active check:
    // 1. Exact match for dashboard.
    // 2. StartsWith for other pages, but avoid matching parent routes if a more specific one is active.
    // Example: /organizations should not be active if visiting /organizations/my-org
    // The current logic handles this reasonably well. A simple startsWith is often sufficient.
    const isActive = (href === '/dashboard' && pathname === href) || (href !== '/dashboard' && pathname.startsWith(href));

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
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary font-semibold"
            )}
        >
            <Icon className="h-4 w-4" />
            <span className="group-data-[state=collapsed]:hidden">{label}</span>
        </Link>
    )
}

export function Nav({
    isCollapsed,
    navItems,
}: {
    isCollapsed: boolean;
    navItems: NavItem[];
}) {

  return (
    <nav 
        data-state={isCollapsed ? 'collapsed' : 'expanded'} 
        className={cn("grid items-start gap-1 group", isCollapsed ? "px-2" : "px-4")}
    >
       {navItems.map((item) => (
            <NavLink key={item.href} {...item} isCollapsed={isCollapsed}/>
        ))}
    </nav>
  )
}
