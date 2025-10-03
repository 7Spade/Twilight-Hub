'use client';
// TODO: [P0] FIX Parsing (L67) [低認知][現代化]
// - 問題：Unterminated string literal
// - 指引：補齊引號或簡化字串；避免行內註解破壞字串。

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
      // TODO: [P2] FEAT src/components/features/spaces/components/participants/participant-role-editor.tsx - 實現角色變更 API 調用
      console.log('Changing role:', { participantId, newRole: data.role });
      // @assignee dev
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onRoleChange?.(participantId, data.role);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to change role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'owner':
        return '?��??�?��??��?設�??��??��??��?';
      case 'admin':
        return '?�以管�??�員?�大?��?設�?';
      case 'member':
        // TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 補齊未終止字串
        return '?以檢??編輯內�?';
      case 'viewer':
        return '?能檢??容';
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
            ?�新 {participantName} ?��??�。這�?變更他們在此空?�中?��??��?
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
                        <SelectValue placeholder="?��?角色" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="owner">?��???/SelectItem>
                      <SelectItem value="admin">管�???/SelectItem>
                      <SelectItem value="member">?�員</SelectItem>
                      <SelectItem value="viewer">檢�???/SelectItem>
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
                ?��?
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '?�新�?..' : '?�新角色'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
