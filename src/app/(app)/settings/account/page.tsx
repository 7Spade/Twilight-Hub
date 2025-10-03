'use client';

export default function AccountSettingsPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Account</h1>
      <p className="text-sm text-muted-foreground">Manage your account settings.</p>
    </div>
  );
}

/**
 * 帳戶設定頁面
 * 
 * 功能：
 * - 密碼修改
 * - 電子郵件變更
 * - 帳戶安全設定
 * - 登入歷史
 * 
 * 路由：/settings/account
 * 組件類型：Client Component
 */