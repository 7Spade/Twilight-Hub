'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutDashboard, 
  Compass, 
  Building2, 
  FolderOpen, 
  Settings, 
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

export const defaultNavItems: NavItem[] = [
  { 
    title: '首頁', 
    href: '/', 
    icon: Home 
  },
  { 
    title: '儀表板', 
    href: '/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    title: '發現', 
    href: '/discover', 
    icon: Compass 
  },
  { 
    title: '組織', 
    href: '/organizations', 
    icon: Building2 
  },
  { 
    title: '空間', 
    href: '/spaces', 
    icon: FolderOpen 
  },
  { 
    title: '設定', 
    href: '/settings', 
    icon: Settings 
  },
  { 
    title: '個人資料', 
    href: '/settings/profile', 
    icon: User 
  },
];