'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Key, Mail, Shield, Eye, EyeOff } from 'lucide-react';

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // 表單驗證
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('新密碼確認不匹配');
      setIsLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('新密碼至少需要 6 個字符');
      setIsLoading(false);
      return;
    }

    try {
      // 這裡應該實現密碼變更邏輯
      // 由於 Firebase Auth 需要重新認證，這是一個複雜的操作
      setSuccess('密碼變更功能正在開發中');
    } catch (error) {
      setError('密碼變更失敗，請重試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer 
      title="帳戶設定" 
      description="管理您的帳戶安全和偏好設定"
    >
      <div className="space-y-6">
        {/* 帳戶信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              帳戶信息
            </CardTitle>
            <CardDescription>
              查看您的帳戶基本信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailVerified">電子郵件驗證狀態</Label>
              <div className="flex items-center gap-2">
                <span className={user?.emailVerified ? 'text-green-600' : 'text-yellow-600'}>
                  {user?.emailVerified ? '已驗證' : '未驗證'}
                </span>
                {!user?.emailVerified && (
                  <Button variant="outline" size="sm" disabled>
                    發送驗證郵件
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 密碼設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              密碼設定
            </CardTitle>
            <CardDescription>
              更改您的登入密碼
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">當前密碼</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">新密碼</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">確認新密碼</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
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

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                更新密碼
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 安全設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              安全設定
            </CardTitle>
            <CardDescription>
              管理您的帳戶安全選項
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              更多安全功能正在開發中，包括：
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• 兩因素認證 (2FA)</li>
              <li>• 登入歷史記錄</li>
              <li>• 活動通知</li>
              <li>• 會話管理</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}