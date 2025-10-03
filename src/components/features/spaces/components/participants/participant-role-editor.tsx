'use client';

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
      // TODO: Implement role change API call
      console.log('Changing role:', { participantId, newRole: data.role });
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
        return '?æ??€?‰å??½å?è¨­å??„å??´å??–æ?';
      case 'admin':
        return '?¯ä»¥ç®¡ç??å“¡?Œå¤§?¨å?è¨­å?';
      case 'member':
        return '?¯ä»¥æª¢è??Œç·¨è¼¯å…§å®?;
      case 'viewer':
        return '?ªèƒ½æª¢è??§å®¹';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>è®Šæ›´è§’è‰²</DialogTitle>
          <DialogDescription>
            ?´æ–° {participantName} ?„è??²ã€‚é€™å?è®Šæ›´ä»–å€‘åœ¨æ­¤ç©º?“ä¸­?„æ??ã€?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>è§’è‰²</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="?¸å?è§’è‰²" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="owner">?æ???/SelectItem>
                      <SelectItem value="admin">ç®¡ç???/SelectItem>
                      <SelectItem value="member">?å“¡</SelectItem>
                      <SelectItem value="viewer">æª¢è???/SelectItem>
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
                ?–æ?
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '?´æ–°ä¸?..' : '?´æ–°è§’è‰²'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
