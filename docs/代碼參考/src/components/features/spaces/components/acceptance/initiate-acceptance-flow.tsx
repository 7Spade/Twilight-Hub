'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const initiateAcceptanceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high']),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  acceptanceCriteria: z.string().min(1, 'Acceptance criteria is required'),
});

type InitiateAcceptanceFormValues = z.infer<typeof initiateAcceptanceSchema>;

// TODO: 現代化 - 定義完整的驗收項目類型接口，提升類型安全
interface AcceptanceItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  acceptanceCriteria: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requester: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface InitiateAcceptanceFlowProps {
  spaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // TODO: 現代化 - 定義具體的驗收類型接口，提升類型安全
  onAcceptanceCreated?: (acceptance: AcceptanceItem) => void;
}

export function InitiateAcceptanceFlow({
  spaceId,
  open,
  onOpenChange,
  onAcceptanceCreated,
}: InitiateAcceptanceFlowProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InitiateAcceptanceFormValues>({
    resolver: zodResolver(initiateAcceptanceSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      acceptanceCriteria: '',
    },
  });

  const onSubmit = async (data: InitiateAcceptanceFormValues) => {
    setIsLoading(true);
    try {
      // TODO: [P2] FEAT src/components/features/spaces/components/acceptance/initiate-acceptance-flow.tsx - 實作創建驗收 API 呼叫
      console.log('Creating acceptance item:', { spaceId, ...data });
      // @assignee dev
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const newAcceptance = {
        id: Date.now().toString(),
        ...data,
        status: 'pending' as const,
        requester: { id: 'current-user', name: 'Current User' },
        createdAt: new Date(),
        progress: 0,
        comments: 0,
      };
      
      onAcceptanceCreated?.(newAcceptance);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create acceptance item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Initiate Acceptance Flow</DialogTitle>
          <DialogDescription>
            Create a new acceptance item to track work that needs approval or review.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief title for the acceptance item" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed description of what needs to be done"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Assign to team member" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptanceCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acceptance Criteria</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Define the criteria that must be met for this item to be considered complete"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Acceptance Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
