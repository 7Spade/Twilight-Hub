'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

export function AuthForm() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">登入</TabsTrigger>
        <TabsTrigger value="register">註冊</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="space-y-4 mt-6">
        <LoginForm />
      </TabsContent>
      
      <TabsContent value="register" className="space-y-4 mt-6">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
}
