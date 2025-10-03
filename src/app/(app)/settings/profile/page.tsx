'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useFirebase } from '@/firebase/provider';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user } = useAuth();
  const { auth } = useFirebase();
  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Profile</h1>
      <p className="text-sm text-muted-foreground">{user?.email}</p>
      <div className="pt-2">
        <Button onClick={handleLogout} variant="secondary">Logout</Button>
      </div>
    </div>
  );
}

/**
 * 個人資料頁面
 * 
 * 功能：
 * - 用戶資料編輯
 * - 頭像上傳
 * - 個人信息管理
 * - 資料驗證
 * 
 * 路由：/settings/profile
 * 組件類型：Client Component
 */