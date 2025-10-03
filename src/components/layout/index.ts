/**
 * @fileoverview Layout 組件統一導出
 * 整合所有佈局相關組件
 */

// 統一的導航組件
export { 
  Navigation, 
  type NavItem, 
  type NavigationProps 
} from './navigation';

// 佈局組件
export { Header } from './header';
export { Sidebar } from './sidebar';
export { PageContainer } from './page-container';

// 導航子組件
export { TeamSwitcher, type Team } from './team-switcher';
export { UserNav } from './user-nav';
export { Nav } from './nav';
