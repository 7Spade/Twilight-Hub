'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Mail, MessageSquare, Users, FileText, Shield } from 'lucide-react';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      frequency: 'immediate',
      types: {
        mentions: true,
        comments: true,
        updates: false,
        security: true,
      }
    },
    push: {
      enabled: true,
      types: {
        mentions: true,
        comments: false,
        updates: false,
        security: true,
      }
    },
    inApp: {
      enabled: true,
      types: {
        mentions: true,
        comments: true,
        updates: true,
        security: true,
      }
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 這裡應該實現保存設定到 Firebase 的邏輯
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬 API 調用
      setSuccess('通知設定已保存');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] };
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  return (
    <PageContainer 
      title="通知設定" 
      description="管理您接收通知的方式和偏好"
    >
      <div className="space-y-6">
        {/* 電子郵件通知 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              電子郵件通知
            </CardTitle>
            <CardDescription>
              管理您通過電子郵件接收的通知
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-enabled">啟用電子郵件通知</Label>
                <p className="text-sm text-muted-foreground">
                  接收重要更新的電子郵件通知
                </p>
              </div>
              <Switch
                id="email-enabled"
                checked={settings.email.enabled}
                onCheckedChange={(checked) => updateSetting('email.enabled', checked)}
              />
            </div>

            {settings.email.enabled && (
              <>
    <div className="space-y-2">
                  <Label>通知頻率</Label>
                  <Select
                    value={settings.email.frequency}
                    onValueChange={(value) => updateSetting('email.frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">即時</SelectItem>
                      <SelectItem value="daily">每日摘要</SelectItem>
                      <SelectItem value="weekly">每週摘要</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">通知類型</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="email-mentions">提及</Label>
                      </div>
                      <Switch
                        id="email-mentions"
                        checked={settings.email.types.mentions}
                        onCheckedChange={(checked) => updateSetting('email.types.mentions', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="email-comments">評論</Label>
                      </div>
                      <Switch
                        id="email-comments"
                        checked={settings.email.types.comments}
                        onCheckedChange={(checked) => updateSetting('email.types.comments', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="email-updates">更新</Label>
                      </div>
                      <Switch
                        id="email-updates"
                        checked={settings.email.types.updates}
                        onCheckedChange={(checked) => updateSetting('email.types.updates', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="email-security">安全</Label>
                      </div>
                      <Switch
                        id="email-security"
                        checked={settings.email.types.security}
                        onCheckedChange={(checked) => updateSetting('email.types.security', checked)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 推送通知 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              推送通知
            </CardTitle>
            <CardDescription>
              管理瀏覽器推送通知
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-enabled">啟用推送通知</Label>
                <p className="text-sm text-muted-foreground">
                  在瀏覽器中接收即時通知
                </p>
              </div>
              <Switch
                id="push-enabled"
                checked={settings.push.enabled}
                onCheckedChange={(checked) => updateSetting('push.enabled', checked)}
              />
            </div>

            {settings.push.enabled && (
              <div className="space-y-4">
                <h4 className="font-medium">通知類型</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="push-mentions">提及</Label>
                    </div>
                    <Switch
                      id="push-mentions"
                      checked={settings.push.types.mentions}
                      onCheckedChange={(checked) => updateSetting('push.types.mentions', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="push-comments">評論</Label>
                    </div>
                    <Switch
                      id="push-comments"
                      checked={settings.push.types.comments}
                      onCheckedChange={(checked) => updateSetting('push.types.comments', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="push-security">安全</Label>
                    </div>
                    <Switch
                      id="push-security"
                      checked={settings.push.types.security}
                      onCheckedChange={(checked) => updateSetting('push.types.security', checked)}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 應用內通知 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              應用內通知
            </CardTitle>
            <CardDescription>
              管理應用內的通知顯示
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inapp-enabled">啟用應用內通知</Label>
                <p className="text-sm text-muted-foreground">
                  在應用內顯示通知提示
                </p>
              </div>
              <Switch
                id="inapp-enabled"
                checked={settings.inApp.enabled}
                onCheckedChange={(checked) => updateSetting('inApp.enabled', checked)}
              />
            </div>

            {settings.inApp.enabled && (
              <div className="space-y-4">
                <h4 className="font-medium">通知類型</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="inapp-mentions">提及</Label>
                    </div>
                    <Switch
                      id="inapp-mentions"
                      checked={settings.inApp.types.mentions}
                      onCheckedChange={(checked) => updateSetting('inApp.types.mentions', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="inapp-comments">評論</Label>
                    </div>
                    <Switch
                      id="inapp-comments"
                      checked={settings.inApp.types.comments}
                      onCheckedChange={(checked) => updateSetting('inApp.types.comments', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="inapp-updates">更新</Label>
                    </div>
                    <Switch
                      id="inapp-updates"
                      checked={settings.inApp.types.updates}
                      onCheckedChange={(checked) => updateSetting('inApp.types.updates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="inapp-security">安全</Label>
                    </div>
                    <Switch
                      id="inapp-security"
                      checked={settings.inApp.types.security}
                      onCheckedChange={(checked) => updateSetting('inApp.types.security', checked)}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 成功訊息 */}
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* 保存按鈕 */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '保存中...' : '保存設定'}
          </Button>
        </div>
    </div>
    </PageContainer>
  );
}