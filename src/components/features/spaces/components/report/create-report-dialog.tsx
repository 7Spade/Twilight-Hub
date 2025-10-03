'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const createReportSchema = z.object({
  title: z.string().min(1, 'Report title is required'),
  type: z.enum(['summary', 'detailed', 'analytics', 'export']),
  description: z.string().optional(),
  dateRange: z.object({
    start: z.string().min(1, 'Start date is required'),
    end: z.string().min(1, 'End date is required'),
  }),
  includeFiles: z.boolean().default(true),
  includeActivity: z.boolean().default(true),
  includeMetrics: z.boolean().default(true),
  includeIssues: z.boolean().default(false),
  format: z.enum(['pdf', 'excel', 'csv']).default('pdf'),
});

type CreateReportFormValues = z.infer<typeof createReportSchema>;

interface CreateReportDialogProps {
  spaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReportCreated?: (report: any) => void;
}

export function CreateReportDialog({
  spaceId,
  open,
  onOpenChange,
  onReportCreated,
}: CreateReportDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateReportFormValues>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      title: '',
      type: 'summary',
      description: '',
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        end: new Date().toISOString().split('T')[0], // today
      },
      includeFiles: true,
      includeActivity: true,
      includeMetrics: true,
      includeIssues: false,
      format: 'pdf',
    },
  });

  const onSubmit = async (data: CreateReportFormValues) => {
    setIsLoading(true);
    try {
      // TODO: Implement create report API call
      console.log('Creating report:', { spaceId, ...data });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const newReport = {
        id: Date.now().toString(),
        ...data,
        status: 'generating' as const,
        createdAt: new Date(),
        createdBy: { id: 'current-user', name: 'Current User' },
      };
      
      onReportCreated?.(newReport);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'summary':
        return 'Quick overview with key metrics and highlights';
      case 'detailed':
        return 'Comprehensive report with full analysis and insights';
      case 'analytics':
        return 'Data-driven analysis with charts and trends';
      case 'export':
        return 'Raw data export for external analysis';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Create a new report for this space. Select the type and configure the options below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Monthly Activity Summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="summary">?? Summary Report</SelectItem>
                      <SelectItem value="detailed">?? Detailed Report</SelectItem>
                      <SelectItem value="analytics">?? Analytics Report</SelectItem>
                      <SelectItem value="export">?“¦ Data Export</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {getTypeDescription(form.watch('type'))}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of this report"
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
                name="dateRange.start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateRange.end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Include Data</h3>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="includeFiles"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>File Information</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Include file counts, sizes, and metadata
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="includeActivity"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Activity Logs</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Include user activities and changes
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="includeMetrics"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Quality Metrics</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Include quality scores and metrics
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="includeIssues"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Issues & Tasks</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Include issue tracking and task completion
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Output Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Report'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
