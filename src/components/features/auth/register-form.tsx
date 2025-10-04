'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 表單驗證
    if (formData.password !== formData.confirmPassword) {
      setError('密碼確認不匹配');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('請同意服務條款');
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.displayName);
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : '註冊失敗');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="displayName">顯示名稱</Label>
        <Input
          id="displayName"
          type="text"
          placeholder="您的姓名"
          value={formData.displayName}
          onChange={(e) => handleInputChange('displayName', e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">電子郵件</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">密碼</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">確認密碼</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreeToTerms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
          disabled={isLoading}
        />
        <Label htmlFor="agreeToTerms" className="text-sm">
          我同意服務條款和隱私政策
        </Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        註冊
      </Button>
    </form>
  );
}
