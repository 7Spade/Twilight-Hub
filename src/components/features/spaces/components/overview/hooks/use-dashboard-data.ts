/**
 * @fileoverview 仪表?�数?�管?�Hook
 * ?��??�据?��??��?存�??�态管?��???
 */

import { useState, useEffect, useCallback } from 'react';
import { DashboardStats, ActivityItem } from '../types';

interface UseDashboardDataProps {
  spaceId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseDashboardDataReturn {
  stats: DashboardStats | null;
  activities: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * 仪表?�数?�管?�Hook
 * ?��?统�??�数?�获?��??�态管??
 */
export function useDashboardData({
  spaceId,
  autoRefresh = false,
  refreshInterval = 30000 // 30�?
}: UseDashboardDataProps): UseDashboardDataReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ?��?仪表?��?计数??
  const fetchStats = useCallback(async (): Promise<DashboardStats> => {
    // TODO: ?�换为�?实�?API调用
    // 这�?使用模�??�据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          members: Math.floor(Math.random() * 50) + 10,
          files: Math.floor(Math.random() * 200) + 50,
          issues: Math.floor(Math.random() * 20) + 2,
          lastActivity: '2 hours ago',
          storageUsed: Math.floor(Math.random() * 80) + 20,
          storageLimit: 100,
          activeUsers: Math.floor(Math.random() * 15) + 5,
          completedTasks: Math.floor(Math.random() * 30) + 10
        });
      }, 1000);
    });
  }, []);

  // ?��??�近活?�数??
  const fetchActivities = useCallback(async (): Promise<ActivityItem[]> => {
    // TODO: ?�换为�?实�?API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockActivities: ActivityItem[] = [
          {
            id: '1',
            type: 'file_upload',
            user: {
              id: 'user1',
              name: 'John Doe',
              avatar: '/avatars/john.jpg'
            },
            description: 'uploaded a new file',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            metadata: { fileName: 'project-spec.pdf' },
            status: 'completed'
          },
          {
            id: '2',
            type: 'member_join',
            user: {
              id: 'user2',
              name: 'Jane Smith',
              avatar: '/avatars/jane.jpg'
            },
            description: 'joined the space',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            status: 'completed'
          },
          {
            id: '3',
            type: 'issue_created',
            user: {
              id: 'user3',
              name: 'Mike Johnson',
              avatar: '/avatars/mike.jpg'
            },
            description: 'created a new issue',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
            metadata: { issueTitle: 'Bug in authentication flow' },
            status: 'pending'
          },
          {
            id: '4',
            type: 'comment_added',
            user: {
              id: 'user4',
              name: 'Sarah Wilson',
              avatar: '/avatars/sarah.jpg'
            },
            description: 'commented on issue',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
            metadata: { issueId: 'issue-123', comment: 'This needs immediate attention' },
            status: 'completed'
          }
        ];
        resolve(mockActivities);
      }, 800);
    });
  }, []);

  // ?�新?�据
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsData, activitiesData] = await Promise.all([
        fetchStats(),
        fetchActivities()
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats, fetchActivities]);

  // ?��??�据?�载
  useEffect(() => {
    if (spaceId) {
      refresh();
    }
  }, [spaceId, refresh]);

  // ?�动?�新
  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  return {
    stats,
    activities,
    isLoading,
    error,
    refresh,
    lastUpdated
  };
}
