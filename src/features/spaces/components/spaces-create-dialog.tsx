/**
 * @fileoverview A dialog component for creating new spaces.
 * It uses a global Zustand store (`useDialogStore`) to manage its visibility and
 * is triggered from various parts of the UI. The form handles the creation logic,
 * including setting the name, description, and public/private visibility.
 */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDialogState } from '@/hooks/use-app-state';
import { type Team } from '@/components/layout/team-switcher';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { spaceBaseSchema, type SpaceBaseFormValues } from '@/features/spaces/spaces-schemas';
import { useSpaceActions } from '@/features/spaces/hooks';

type CreateSpaceFormValues = SpaceBaseFormValues;

export function SpaceCreateDialog({ selectedTeam }: { selectedTeam: Team | null }) {
  const { type, isOpen, close } = useDialogState();
  const { createSpace, isLoading } = useSpaceActions();

  const isDialogVisible = isOpen && type === 'createSpace';

  const form = useForm<CreateSpaceFormValues>({
    resolver: zodResolver(spaceBaseSchema),
    defaultValues: { name: '', description: '', isPublic: false },
  });

  const onSubmit = async (values: CreateSpaceFormValues) => {
    if (!selectedTeam) {
      return;
    }

    const success = await createSpace({
      ...values,
      ownerId: selectedTeam.id,
    });

    if (success) {
      form.reset();
      close();
    }
  };

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <Dialog open={isDialogVisible} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create a new space
          </DialogTitle>
          <DialogDescription>
            Build a collaborative workspace for {selectedTeam?.label || 'your account'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Phoenix" {...field} />
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
                      placeholder="A short description of your new space."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Public Space</FormLabel>
                    <FormDescription>
                      Anyone on the internet can see this space.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedTeam || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Creating...' : 'Create Space'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
