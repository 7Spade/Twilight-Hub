/**
 * @fileoverview 儀表板數據管理 Hook
 * 提供數據獲取和狀態管理功能
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
 * 儀表板數據管理 Hook
 * 提供統一的數據獲取和狀態管理
 */
export function useDashboardData({
  spaceId,
  autoRefresh = false,
  refreshInterval = 30000 // 30秒
}: UseDashboardDataProps): UseDashboardDataReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 獲取儀表板統計數據
  const fetchStats = useCallback(async (): Promise<DashboardStats> => {
    // TODO: [P2] FEAT src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
    // 這裡使用模擬數據
    // @assignee dev
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          members: Math.floor(Math.random() * 50) + 10,
          files: Math.floor(Math.random() * 200) + 50,
          issues: Math.floor(Math.random() * 20) + 2,
          lastActivity: '2 hours ago',
          storageUsed: Math.floor(Math.random() * 80) + 20,
          storageTotal: 100,
        });
      }, 1000);
    });
  }, []);

  // 獲取活動數據
  const fetchActivities = useCallback(async (): Promise<ActivityItem[]> => {
    // TODO: [P2] FEAT src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
    // 這裡使用模擬數據
    // @assignee dev
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockActivities: ActivityItem[] = [
          {
            id: '1',
            type: 'file_upload',
            user: 'John Doe',
            description: '上傳了新文件',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30分鐘前
            metadata: {
              fileName: 'project-plan.pdf',
              fileSize: '2.5 MB'
            }
          },
          {
            id: '2',
            type: 'comment',
            user: 'Jane Smith',
            description: '添加了評論',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小時前
            metadata: {
              targetType: 'document',
              targetName: 'requirements.md'
            }
          },
          {
            id: '3',
            type: 'member_join',
            user: 'Bob Wilson',
            description: '加入了空間',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4小時前
            metadata: {
              role: 'member'
            }
          }
        ];
        resolve(mockActivities);
      }, 800);
    });
  }, []);

  // 刷新數據
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [statsData, activitiesData] = await Promise.all([
        fetchStats(),
        fetchActivities()
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '數據獲取失敗';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats, fetchActivities]);

  // 初始載入
  useEffect(() => {
    refresh();
  }, [refresh]);

  // 自動刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  return {
    stats,
    activities,
    isLoading,
    error,
    refresh,
    lastUpdated,
  };
}

export default useDashboardData;