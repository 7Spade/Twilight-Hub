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
import { ParticipantInviteFormData, ParticipantRole } from './types';

const inviteSchema = z.object({
  email: z.string().email('請輸?��??��??��??�件?��?'),
  role: z.enum(['admin', 'member', 'viewer']),
  message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteParticipantDialogProps {
  spaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: ParticipantRole, message?: string) => Promise<void>;
}

export function InviteParticipantDialog({ 
  spaceId, 
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
          <DialogTitle>?��??�員</DialogTitle>
          <DialogDescription>
            ?�送�?請以?�入此空?�。�??��??�到?�含?�請�??��??�件??
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>?��??�件?��?</FormLabel>
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
                        <SelectValue placeholder="?��?角色" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 行 103 之後 SelectItem 標籤關閉不正確，請補齊 </SelectItem> */}
                      <SelectItem value="admin">管???/SelectItem>
                      <SelectItem value="member">?員</SelectItem>
                      {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 行 105 未正確關閉標籤，請修正 JSX 結構 */}
                      <SelectItem value="viewer">檢???/SelectItem>
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
                  <FormLabel>?�人訊息 (?�填)</FormLabel>
                  <FormControl>
                    <Input placeholder="?��??�人訊息..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                ?��?
              </Button>
              <Button type="submit" disabled={isLoading}>
                {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 行 130 字串未終止，請補齊引號或用常量 */}
                {isLoading ? '?送中...' : '?送??}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
