"use client";

import Link from "next/link";
import React from "react";
import {
  Bell,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useChatStore } from "@/hooks/use-chat-store";
import { NotificationPopover } from "@/components/notification-popover";
import { UserNav } from "./user-nav";
import { Nav } from "./nav";

export function Header({
  isCollapsed,
  setIsCollapsed,
  navItems,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  navItems: React.ComponentProps<typeof Nav>['navItems'];
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
        <SheetContent side="left" className="sm:max-w-xs">
          <Nav isCollapsed={false} navItems={navItems} />
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

      {/* Breadcrumbs (for larger screens) */}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Recent</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Actions */}
      <div className="ml-auto flex items-center gap-2">
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
        <UserNav />
      </div>
    </header>
  );
}
