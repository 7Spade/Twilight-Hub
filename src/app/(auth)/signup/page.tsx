'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthForm } from '@/components/features/auth/auth-form';
import Logo from '@/components/logo';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo 和標題 */}
        <div className="text-center space-y-2">
          <Logo />
          <h1 className="text-2xl font-semibold">加入 Twilight-Hub</h1>
          <p className="text-sm text-muted-foreground">
            創建帳戶以開始使用
          </p>
        </div>
        
        {/* 認證表單 */}
        <Card>
          <CardContent className="p-6">
            <AuthForm />
          </CardContent>
        </Card>
        
        {/* 額外信息 */}
        <div className="text-center text-xs text-muted-foreground">
          <p>繼續使用即表示您同意我們的服務條款</p>
        </div>
      </div>
    </div>
  );
}