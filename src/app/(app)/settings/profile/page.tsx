'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, userProfile, signOut, refreshUserProfile } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      setError('登出失敗，請重試');
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = userProfile?.displayName || user?.displayName || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <PageContainer 
      title="個人資料" 
      description="管理您的個人信息和帳戶設定"
    >
      <div className="space-y-6">
        {/* 個人資料卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              個人資料
            </CardTitle>
            <CardDescription>
              查看和管理您的個人信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 頭像 */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile?.photoURL || user?.photoURL || ''} alt={displayName} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{displayName}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">顯示名稱</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {/* 帳戶信息 */}
            <div className="space-y-4">
              <h4 className="font-medium">帳戶信息</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">電子郵件驗證:</span>
                  <span className={user?.emailVerified ? 'text-green-600' : 'text-yellow-600'}>
                    {user?.emailVerified ? '已驗證' : '未驗證'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">加入時間:</span>
                  <span>{userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : '未知'}</span>
                </div>
              </div>
            </div>

            {/* 錯誤和成功訊息 */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* 操作按鈕 */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/settings/account')}>
                帳戶設定
              </Button>
              <Button variant="destructive" onClick={handleLogout} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                登出
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}