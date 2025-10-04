'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FolderOpen, Building2, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();

  const displayName = userProfile?.displayName || user?.displayName || user?.email || 'User';

  return (
    <div className="space-y-6">
      {/* 歡迎標題 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">歡迎回來，{displayName}！</h1>
        <p className="text-muted-foreground">這是您的個人儀表板，您可以在此查看和管理您的內容。</p>
      </div>

      {/* 快速操作卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">我的空間</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0 個新空間
            </p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href="/spaces">查看空間</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">組織</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0 個新組織
            </p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href="/organizations">查看組織</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">協作夥伴</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0 個新夥伴
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">統計</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              總活動數
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 最近活動 */}
      <Card>
        <CardHeader>
          <CardTitle>最近活動</CardTitle>
          <CardDescription>您最近的活動記錄</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <LayoutDashboard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>暫無活動記錄</p>
            <p className="text-sm">開始創建您的第一個空間或組織吧！</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}