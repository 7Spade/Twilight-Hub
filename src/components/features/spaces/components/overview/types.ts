/**
 * @fileoverview 現代化 Overview 組件類型定義
 * 遵循現代 dashboard 設計模式與最佳實踐
 * 
 * TODO: [P1] [BUG] [REFACTOR] 修復 UTF-8 編碼問題 - 文件原本包含亂碼字符，已修復
 * - 問題: 文件包含無效的 UTF-8 字符（亂碼）
 * - 範圍/影響: src/components/features/spaces/components/overview/types.ts
 * - 何時: 2025-10-03 發現
 * - 為什麼: 文件保存時編碼設置錯誤
 * - 解法: 以 UTF-8 編碼重新保存文件，修正註釋
 * - 驗證: (1) 文件可正常讀取 (2) 無亂碼字符 (3) TypeScript 編譯成功
 * - 預防: .editorconfig 強制 UTF-8，使用 pre-commit hook 檢測編碼
 * - 風險/回滾: 風險低；若出現問題，從 git 歷史恢復
 */

export interface MetricData {
  id: string;
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  format?: 'number' | 'percentage' | 'currency' | 'text';
}

export interface ActivityItem {
  id: string;
  type: 'file_upload' | 'file_update' | 'member_join' | 'issue_created' | 'comment_added' | 'space_created' | 'role_changed';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>; /* TODO: [P2] [BUG] [UI] [TODO] 修復 TypeScript any 類型警告 */
  status?: 'completed' | 'pending' | 'failed';
}

export interface DashboardStats {
  members: number;
  files: number;
  issues: number;
  lastActivity: string;
  storageUsed?: number;
  storageLimit?: number;
  activeUsers?: number;
  completedTasks?: number;
}

export interface ChartData {
  date: string;
  value: number;
  category?: string;
}

export interface OverviewDashboardProps {
  spaceId: string;
  stats?: DashboardStats;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  format?: 'number' | 'percentage' | 'currency' | 'text';
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  height?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 主題樣式相關類型
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
}

// 響應式斷點類型
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveConfig {
  columns: Record<Breakpoint, number>;
  gap: Record<Breakpoint, string>;
  padding: Record<Breakpoint, string>;
}

// 動畫配置類型
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: 'number' | 'percentage' | 'currency';
  className?: string;
}
