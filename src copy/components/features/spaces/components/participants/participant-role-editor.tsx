'use client';
// 已處理：移除此檔 P0 解析錯誤 TODO（字串與描述皆完整）

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const roleSchema = z.object({
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface ParticipantRoleEditorProps {
  participantId: string;
  participantName: string;
  currentRole: 'owner' | 'admin' | 'member' | 'viewer';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChange?: (participantId: string, newRole: string) => void;
}

export function ParticipantRoleEditor({
  participantId,
  participantName,
  currentRole,
  open,
  onOpenChange,
  onRoleChange,
}: ParticipantRoleEditorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: currentRole,
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    setIsLoading(true);
    try {
      // TODO: 實現角色變更 API 調用
      console.log('Changing role:', { participantId, newRole: data.role });
      // @assignee dev
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onRoleChange?.(participantId, data.role);
      onOpenChange(false);
    } catch (error) {
      // TODO: 實現錯誤處理機制
      console.error('Failed to change role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'owner':
        return '擁有最高權限，可管理空間與設定';
      case 'admin':
        return '可以管理成員與大部分設定';
      case 'member':
        return '可以檢視與編輯內容';
      case 'viewer':
        return '只能檢視內容';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>變更角色</DialogTitle>
          <DialogDescription>
            將更新 {participantName} 的角色。這會變更他們在此空間中的權限。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <SelectItem value="owner">擁有者</SelectItem>
                      <SelectItem value="admin">管理員</SelectItem>
                      <SelectItem value="member">成員</SelectItem>
                      <SelectItem value="viewer">檢視者</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('role') && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  {getRoleDescription(form.watch('role'))}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '更新中..' : '更新角色'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
