/**
 * @fileoverview 现代化Overview组件的类型定义
 * 基于现代dashboard设计模式和最佳实践
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
  metadata?: Record<string, any>;
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

// 主题和样式相关类型
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

// 响应式断点类型
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveConfig {
  columns: Record<Breakpoint, number>;
  gap: Record<Breakpoint, string>;
  padding: Record<Breakpoint, string>;
}

// 动画配置类型
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
