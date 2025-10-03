// Barrel file for overview components.
export { OverviewDashboard } from './overview-dashboard';
export { StatCard } from './stat-card';
export { RecentActivity } from './recent-activity';

// Loading and utility components
export { 
  LoadingSkeleton, 
  MetricCardSkeleton, 
  ActivitySkeleton, 
  ChartSkeleton 
} from './loading-skeleton';

// Hooks
export { useDashboardData } from './hooks/use-dashboard-data';

// Types
export type {
  MetricData,
  ActivityItem,
  DashboardStats,
  ChartData,
  OverviewDashboardProps,
  StatCardProps,
  LoadingSkeletonProps,
  ErrorBoundaryProps,
  EmptyStateProps,
  Theme,
  ThemeConfig,
  ResponsiveConfig,
  AnimationConfig,
  AnimatedNumberProps
} from './types';