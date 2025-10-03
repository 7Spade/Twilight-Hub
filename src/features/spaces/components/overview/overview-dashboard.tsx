'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Calendar, Activity } from 'lucide-react';
import { StatCard } from './stat-card';
import { RecentActivity } from './recent-activity';

interface OverviewDashboardProps {
  spaceId: string;
  stats?: {
    members: number;
    files: number;
    lastActivity: string;
    issues: number;
  };
}

export function OverviewDashboard({ spaceId, stats }: OverviewDashboardProps) {
  const defaultStats = {
    members: 0,
    files: 0,
    lastActivity: 'No recent activity',
    issues: 0,
    ...stats,
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Members"
          value={defaultStats.members}
          icon={Users}
          description="Active participants"
        />
        <StatCard
          title="Files"
          value={defaultStats.files}
          icon={FileText}
          description="Total files"
        />
        <StatCard
          title="Issues"
          value={defaultStats.issues}
          icon={Activity}
          description="Open issues"
        />
        <StatCard
          title="Last Activity"
          value={defaultStats.lastActivity}
          icon={Calendar}
          description="Recent update"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity spaceId={spaceId} />
        </CardContent>
      </Card>
    </div>
  );
}
