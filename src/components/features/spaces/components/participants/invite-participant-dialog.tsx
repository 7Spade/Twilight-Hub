// TODO: [P0] FIX src/components/features/spaces/components/participants/invite-participant-dialog.tsx - 修復語法錯誤（第98行 Unexpected token）
// 說明：檢查 JSX 標籤是否缺失閉合或有非法字元
'use client';
// TODO: [P0] FIX Parsing (L100) [低認知][現代化]
// - 問題：Unexpected token（可能需 {'>'} 或 &gt;）
// - 指引：檢查 JSX 標籤閉合，將裸 '>' 轉義為 {'>'}。

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ParticipantInviteFormData as _ParticipantInviteFormData, ParticipantRole } from './types';

const inviteSchema = z.object({
  email: z.string().email('請輸?��??��??��??�件?��?'),
  role: z.enum(['admin', 'member', 'viewer']),
  message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteParticipantDialogProps {
  _spaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: ParticipantRole, message?: string) => Promise<void>;
}

export function InviteParticipantDialog({
  _spaceId,
  open,
  onOpenChange,
  onInvite
}: InviteParticipantDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'member',
      message: '',
    },
  });

  const onSubmit = async (data: InviteFormValues) => {
    setIsLoading(true);
    try {
      await onInvite(data.email, data.role, data.message);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to invite participant:', error);
      // TODO: [P2] FEAT src/components/features/spaces/components/participants/invite-participant-dialog.tsx - 顯示錯誤提示
      // @assignee dev
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>邀請成員</DialogTitle>
          <DialogDescription>
            發送邀請以加入此空間。受邀者將會收到包含邀請連結的電子郵件。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電子郵件</FormLabel>
                  <FormControl>
                    <Input placeholder="colleague@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇角色" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">管理員</SelectItem>
                      <SelectItem value="member">成員</SelectItem>
                      <SelectItem value="viewer">檢視者</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>個人訊息（選填）</FormLabel>
                  <FormControl>
                    <Input placeholder="輸入個人訊息..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '傳送中...' : '傳送邀請'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
