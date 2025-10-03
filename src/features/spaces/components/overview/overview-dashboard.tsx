'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calendar, 
  Activity, 
  RefreshCw, 
  AlertTriangle,
  HardDrive,
  UserCheck,
  CheckCircle
} from 'lucide-react';
import { StatCard } from './stat-card';
import { RecentActivity } from './recent-activity';
import { LoadingSkeleton, MetricCardSkeleton } from './loading-skeleton';
import { useDashboardData } from './hooks/use-dashboard-data';
import { OverviewDashboardProps } from './types';
import { cn } from '@/lib/utils';

/**
 * 现代化的仪表板主组件
 * 提供完整的空间概览和交互功能
 */
export function OverviewDashboard({ 
  spaceId, 
  stats: externalStats,
  isLoading: externalLoading = false,
  error: externalError = null,
  onRefresh
}: OverviewDashboardProps) {
  const { 
    stats, 
    activities, 
    isLoading: dataLoading, 
    error: dataError, 
    refresh,
    lastUpdated 
  } = useDashboardData({ 
    spaceId, 
    autoRefresh: true,
    refreshInterval: 60000 // 1分钟自动刷新
  });

  const isLoading = externalLoading || dataLoading;
  const error = externalError || dataError;

  // 使用外部传入的stats或内部获取的stats
  const displayStats = externalStats || stats;

  const handleRefresh = async () => {
    await refresh();
    onRefresh?.();
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Failed to load dashboard
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error}
            </p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Space activity and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <Badge variant="outline" className="text-xs">
              Updated {lastUpdated.toLocaleTimeString()}
            </Badge>
          )}
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* 指标网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <MetricCardSkeleton key={index} />
          ))
        ) : displayStats ? (
          <>
            <StatCard
              title="Members"
              value={displayStats.members}
              icon={Users}
              description="Active participants"
              color="blue"
              trend={{
                value: Math.floor(Math.random() * 20) - 10,
                isPositive: Math.random() > 0.5,
                period: "last week"
              }}
              onClick={() => console.log('Navigate to members')}
            />
            <StatCard
              title="Files"
              value={displayStats.files}
              icon={FileText}
              description="Total files"
              color="green"
              trend={{
                value: Math.floor(Math.random() * 15),
                isPositive: true,
                period: "last week"
              }}
              onClick={() => console.log('Navigate to files')}
            />
            <StatCard
              title="Issues"
              value={displayStats.issues}
              icon={Activity}
              description="Open issues"
              color="red"
              trend={{
                value: Math.floor(Math.random() * 10),
                isPositive: Math.random() > 0.7,
                period: "last week"
              }}
              onClick={() => console.log('Navigate to issues')}
            />
            <StatCard
              title="Storage"
              value={`${displayStats.storageUsed || 0}%`}
              icon={HardDrive}
              description={`${displayStats.storageUsed || 0}GB of ${displayStats.storageLimit || 100}GB used`}
              color="purple"
              format="percentage"
              trend={{
                value: Math.floor(Math.random() * 5),
                isPositive: false,
                period: "last month"
              }}
            />
          </>
        ) : null}
      </div>

      {/* 次要指标 */}
      {displayStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Active Users"
            value={displayStats.activeUsers || 0}
            icon={UserCheck}
            description="Currently online"
            color="yellow"
            format="number"
          />
          <StatCard
            title="Completed Tasks"
            value={displayStats.completedTasks || 0}
            icon={CheckCircle}
            description="This month"
            color="green"
            format="number"
            trend={{
              value: Math.floor(Math.random() * 25),
              isPositive: true,
              period: "last month"
            }}
          />
          <StatCard
            title="Last Activity"
            value={displayStats.lastActivity}
            icon={Calendar}
            description="Recent update"
            color="gray"
            format="text"
          />
        </div>
      )}

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton count={3} />
          ) : (
            <RecentActivity 
              spaceId={spaceId} 
              activities={activities}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
