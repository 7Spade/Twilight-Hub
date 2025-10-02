'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';

import { useFirestore } from '@/firebase';
import { useDialogStore } from '@/hooks/use-dialog-store';
import { useToast } from '@/hooks/use-toast';
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

const createSpaceSchema = z.object({
  name: z.string().min(1, { message: 'Space name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  isPublic: z.boolean().default(false),
});

type CreateSpaceFormValues = z.infer<typeof createSpaceSchema>;

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // replace multiple hyphens with a single one
};

export function CreateSpaceDialog({ selectedTeam }: { selectedTeam: Team | null }) {
  const firestore = useFirestore();
  const { type, isOpen, close } = useDialogStore();
  const { toast } = useToast();

  const isDialogVisible = isOpen && type === 'createSpace';

  const form = useForm<CreateSpaceFormValues>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: { name: '', description: '', isPublic: false },
  });

  const onSubmit = async (values: CreateSpaceFormValues) => {
    if (!firestore || !selectedTeam) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot create a space without a selected team.',
      });
      return;
    }

    try {
      const spacesRef = collection(firestore, 'spaces');
      const newSpace = {
        ...values,
        slug: generateSlug(values.name),
        ownerId: selectedTeam.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        moduleIds: [],
        starredByUserIds: [],
      };

      await addDoc(spacesRef, newSpace);

      toast({
        title: 'Success!',
        description: `Space "${values.name}" has been created.`,
      });

      form.reset();
      close();
    } catch (error) {
      console.error('Error creating space:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create space',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <Dialog open={isDialogVisible} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new space for {selectedTeam?.label || 'your account'}
          </DialogTitle>
          <DialogDescription>
            Fill out the details to get started.
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedTeam || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Creating...' : 'Create Space'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
