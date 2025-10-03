'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { StatCard } from '../overview/stat-card';

interface QualityMetrics {
  overallScore: number;
  completedChecks: number;
  totalChecks: number;
  criticalIssues: number;
  warnings: number;
  trends: {
    scoreChange: number;
    completionRate: number;
    issueResolutionTime: number;
  };
}

interface QualityDashboardProps {
  spaceId: string;
  metrics?: QualityMetrics;
}

export function QualityDashboard({ spaceId: _spaceId, metrics }: QualityDashboardProps) {
  // TODO: [P3] REFACTOR src/components/features/spaces/components/quality/quality-dashboard.tsx - 清理未使用的參數（spaceId 未使用）
  const defaultMetrics: QualityMetrics = {
    overallScore: 85,
    completedChecks: 12,
    totalChecks: 15,
    criticalIssues: 2,
    warnings: 5,
    trends: {
      scoreChange: 5,
      completionRate: 80,
      issueResolutionTime: 2.5,
    },
    ...metrics,
  };

  const completionRate = (defaultMetrics.completedChecks / defaultMetrics.totalChecks) * 100;

  return (
    <div className="space-y-6">
      {/* Quality Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quality Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {defaultMetrics.overallScore}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Quality Score</p>
            </div>
            <Progress value={defaultMetrics.overallScore} className="h-3" />
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {defaultMetrics.trends.scoreChange > 0 ? '+' : ''}{defaultMetrics.trends.scoreChange}% from last week
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed Checks"
          value={`${defaultMetrics.completedChecks}/${defaultMetrics.totalChecks}`}
          icon={CheckCircle}
          description={`${completionRate.toFixed(0)}% completion rate`}
          trend={{
            value: defaultMetrics.trends.completionRate,
            isPositive: true,
          }}
        />
        <StatCard
          title="Critical Issues"
          value={defaultMetrics.criticalIssues}
          icon={AlertTriangle}
          description="Requires immediate attention"
        />
        <StatCard
          title="Warnings"
          value={defaultMetrics.warnings}
          icon={Clock}
          description="Non-critical issues"
        />
        <StatCard
          title="Resolution Time"
          value={`${defaultMetrics.trends.issueResolutionTime} days`}
          icon={TrendingUp}
          description="Average time to resolve"
        />
      </div>

      {/* Quality Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Checklist Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Code Quality</span>
                <span className="text-sm text-muted-foreground">8/10</span>
              </div>
              <Progress value={80} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Testing</span>
                <span className="text-sm text-muted-foreground">6/8</span>
              </div>
              <Progress value={75} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Documentation</span>
                <span className="text-sm text-muted-foreground">4/5</span>
              </div>
              <Progress value={80} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Security</span>
                <span className="text-sm text-muted-foreground">3/4</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quality Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Authentication vulnerability</p>
                  <p className="text-xs text-muted-foreground">High priority ??2 days ago</p>
                </div>
                <Badge variant="destructive" className="text-xs">Critical</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Missing unit tests</p>
                  <p className="text-xs text-muted-foreground">Medium priority ??1 week ago</p>
                </div>
                <Badge variant="secondary" className="text-xs">Warning</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Outdated documentation</p>
                  <p className="text-xs text-muted-foreground">Low priority ??2 weeks ago</p>
                </div>
                <Badge variant="outline" className="text-xs">Info</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
