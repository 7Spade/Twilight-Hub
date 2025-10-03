/**
 * 導航組件
 * 
 * 功能：
 * - 導航菜單渲染
 * - 導航狀態管理
 * - 活動狀態指示
 * - 導航權限控制
 * 
 * 組件類型：Client Component
 * 依賴：AuthProvider
 */

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

export const defaultNavItems: NavItem[] = [
  { title: 'Home', href: '/', icon: () => null },
  { title: 'Dashboard', href: '/dashboard', icon: () => null },
  { title: 'Discover', href: '/discover', icon: () => null },
  { title: 'Organizations', href: '/organizations', icon: () => null },
  { title: 'Spaces', href: '/spaces', icon: () => null },
  { title: 'Settings', href: '/settings', icon: () => null },
  { title: 'Profile', href: '/settings/profile', icon: () => null },
];