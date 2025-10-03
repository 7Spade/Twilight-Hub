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

const createIssueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['bug', 'feature', 'task', 'question']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignee: z.string().optional(),
  labels: z.string().optional(),
});

type CreateIssueFormValues = z.infer<typeof createIssueSchema>;

// TODO: 現代化 - 定義完整的 Issue 類型接口，提升類型安全
interface Issue {
  id: string;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'task' | 'question';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  labels?: string;
  status: 'open' | 'in_progress' | 'closed';
  reporter: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CreateIssueFormProps {
  spaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // TODO: 現代化 - 定義具體的問題類型接口，提升類型安全
  onIssueCreated?: (issue: Issue) => void;
}

export function CreateIssueForm({ spaceId, open, onOpenChange, onIssueCreated }: CreateIssueFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateIssueFormValues>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'bug',
      priority: 'medium',
      assignee: '',
      labels: '',
    },
  });

  const onSubmit = async (data: CreateIssueFormValues) => {
    setIsLoading(true);
    try {
      // TODO: [P2] FEAT src/components/features/spaces/components/issues/create-issue-form.tsx - 實作創建問題 API 呼叫
      console.log('Creating issue:', { spaceId, ...data });
      // @assignee dev
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const newIssue = {
        id: Date.now().toString(),
        ...data,
        status: 'open' as const,
        reporter: { id: 'current-user', name: 'Current User' },
        createdAt: new Date(),
        updatedAt: new Date(),
        labels: data.labels ? data.labels.split(',').map(l => l.trim()) : [],
      };
      
      onIssueCreated?.(newIssue);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create issue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>
            Create a new issue to track bugs, features, tasks, or questions in this space.
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
                    <Input placeholder="Brief description of the issue" {...field} />
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
                      placeholder="Detailed description of the issue, including steps to reproduce if applicable"
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bug">?? Bug</SelectItem>
                        <SelectItem value="feature">??Feature</SelectItem>
                        <SelectItem value="task">?? Task</SelectItem>
                        <SelectItem value="question">??Question</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="labels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Labels (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Comma-separated labels (e.g., bug, ui, authentication)" {...field} />
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
                {isLoading ? 'Creating...' : 'Create Issue'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
