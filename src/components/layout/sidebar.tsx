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

// TODO: [P2] REFACTOR src/components/layout/sidebar.tsx:13 - 清理未使用的導入
// 問題：'Settings' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// TODO: [P2] REFACTOR src/components/layout/sidebar.tsx:15 - 清理未使用的導入
// 問題：'Tooltip', 'TooltipContent', 'TooltipProvider', 'TooltipTrigger' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team
// TODO: [P2] REFACTOR src/components/layout/sidebar.tsx - 奧卡姆剃刀精簡側邊欄
// 建議：
// 1) 刪除未用的視覺裝飾/狀態與條件（保留最小導航能力）。
// 2) 將動態權限與導覽來源集中於單一 selector/hook，避免多處分支與重複邏輯。
// 3) 僅保留使用中之交互（hover/tooltip 適度減量），避免不必要的 re-render 與樣式開銷。

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
