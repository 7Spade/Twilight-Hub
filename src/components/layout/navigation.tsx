/**
 * @fileoverview 統一的導航組件
 * 整合導航相關邏輯，遵循奧卡姆剃刀原則
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TeamSwitcher, type Team } from './team-switcher';
import { UserNav } from './user-nav';
import { type Account } from '@/lib/types-unified';

// 導航項目類型
export interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

// 導航組件屬性
interface NavigationProps {
  navItems: NavItem[];
  teams: Team[];
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team) => void;
  userProfile: Account | null;
  isCollapsed?: boolean;
  className?: string;
}

// 導航鏈接組件
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
  const isActive = (href === '/dashboard' && pathname === href) || 
                   (href !== '/dashboard' && pathname.startsWith(href));

  if (isCollapsed) {
    return (
      <Link
        href={href}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
          isActive && "bg-accent text-accent-foreground"
        )}
        title={label}
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{label}</span>
      </Link>
    );
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
  );
};

// 主要導航組件
export function Navigation({
  navItems,
  teams,
  selectedTeam,
  setSelectedTeam,
  userProfile,
  isCollapsed = false,
  className
}: NavigationProps) {
  return (
    <nav 
      data-state={isCollapsed ? 'collapsed' : 'expanded'} 
      className={cn(
        "grid items-start gap-1 group", 
        isCollapsed ? "px-2" : "px-4",
        className
      )}
    >
      {/* 團隊切換器 */}
      <TeamSwitcher
        teams={teams}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        isCollapsed={isCollapsed}
      />
      
      {/* 導航項目 */}
      {navItems.map((item) => (
        <NavLink 
          key={item.href} 
          {...item} 
          isCollapsed={isCollapsed}
        />
      ))}
      
      {/* 用戶導航 */}
      {userProfile && (
        <div className={cn(
          "mt-auto",
          isCollapsed ? "px-2" : "px-4"
        )}>
          <UserNav userProfile={userProfile} />
        </div>
      )}
    </nav>
  );
}

// 導出類型（NavItem 已在上面定義並導出）
export type { NavigationProps };
