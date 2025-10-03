'use client';

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
  email: z.string().email('Ë´ãËº∏?•Ê??àÁ??ªÂ??µ‰ª∂?∞Â?'),
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
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>?∞Â??êÂì°</DialogTitle>
          <DialogDescription>
            ?≥ÈÄÅÈ?Ë´ã‰ª•?†ÂÖ•Ê≠§Á©∫?ì„ÄÇ‰??ëÂ??∂Âà∞?ÖÂê´?ÄË´ãÁ??ªÂ??µ‰ª∂??
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>?ªÂ??µ‰ª∂?∞Â?</FormLabel>
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
                  <FormLabel>ËßíËâ≤</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="?∏Â?ËßíËâ≤" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">ÁÆ°Á???/SelectItem>
                      <SelectItem value="member">?êÂì°</SelectItem>
                      <SelectItem value="viewer">Ê™¢Ë???/SelectItem>
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
                  <FormLabel>?ã‰∫∫Ë®äÊÅØ (?∏Â°´)</FormLabel>
                  <FormControl>
                    <Input placeholder="?∞Â??ã‰∫∫Ë®äÊÅØ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                ?ñÊ?
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '?≥ÈÄÅ‰∏≠...' : '?≥ÈÄÅÈ?Ë´?}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
