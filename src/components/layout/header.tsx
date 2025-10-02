'use client';

import Link from 'next/link';
import React from 'react';
import {
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useChatStore } from '@/hooks/use-chat-store';
import { NotificationPopover } from '@/components/notification-popover';
import { UserNav } from './user-nav';
import { Nav, type NavItem } from './nav';
import { TeamSwitcher, type Team } from './team-switcher';
import { Separator } from '../ui/separator';
import { SearchCommand } from '../search-command';
import { type Account } from '@/lib/types';

export function Header({
  isCollapsed,
  setIsCollapsed,
  navItems,
  teams,
  selectedTeam,
  setSelectedTeam,
  userProfile
}: {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  navItems: NavItem[];
  teams: Team[];
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team) => void;
  userProfile: Account | null;
}) {
  const { toggle: toggleChat } = useChatStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
             <Link href="/" className="flex items-center gap-2 font-semibold">
                <p>Team</p>
            </Link>
          </div>
          <div className="flex flex-col p-2 gap-2">
            <TeamSwitcher
                teams={teams}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                isCollapsed={false}
            />
            <Separator />
            <Nav isCollapsed={false} navItems={navItems} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden sm:flex"
      >
        {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
      </Button>
      
      {/* Header Actions */}
      <div className="ml-auto flex items-center gap-2">
        <SearchCommand />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleChat}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Messages</span>
        </Button>
        <NotificationPopover />
        <UserNav userProfile={userProfile} />
      </div>
    </header>
  );
}
