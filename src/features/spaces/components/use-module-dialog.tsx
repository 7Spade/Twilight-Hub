'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { useMemo } from 'react';

import { useFirestore, useUser, useCollection } from '@/firebase';
import { useDialogStore } from '@/hooks/use-dialog-store';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const useModuleSchema = z.object({
  spaceId: z.string().min(1, { message: 'Please select a space' }),
});

type UseModuleFormValues = z.infer<typeof useModuleSchema>;

export function UseModuleDialog() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { type, isOpen, close, data } = useDialogStore();
  const { toast } = useToast();

  const { module } = data;

  const isDialogVisible = isOpen && type === 'useModule' && !!module;

  // Get all spaces the user owns or is a member of an org that owns
  const userOrgsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'accounts'),
      where('type', '==', 'organization'),
      where('memberIds', 'array-contains', user.uid)
    );
  }, [firestore, user]);
  const { data: userOrgs, isLoading: userOrgsLoading } =
    useCollection(userOrgsQuery);

  const manageableOwnerIds = useMemo(() => {
    if (!user) return [];
    const ids = [user.uid]; // User can always manage their own spaces
    if (userOrgs) {
      userOrgs.forEach((org) => ids.push(org.id));
    }
    return ids;
  }, [user, userOrgs]);

  const spacesQuery = useMemo(() => {
    if (!firestore || manageableOwnerIds.length === 0) return null;
    return query(
      collection(firestore, 'spaces'),
      where('ownerId', 'in', manageableOwnerIds)
    );
  }, [firestore, manageableOwnerIds]);
  const { data: allSpaces, isLoading: spacesLoading } =
    useCollection(spacesQuery);

  // Filter spaces that don't already have the module
  const availableSpaces = useMemo(() => {
    if (!allSpaces?.length || !module) return [];
    return allSpaces.filter((space) => !space.moduleIds?.includes(module.id));
  }, [allSpaces, module]);

  const form = useForm<UseModuleFormValues>({
    resolver: zodResolver(useModuleSchema),
  });

  const onSubmit = async (values: UseModuleFormValues) => {
    if (!firestore || !module) return;

    try {
      const spaceRef = doc(firestore, 'spaces', values.spaceId);
      await updateDoc(spaceRef, {
        moduleIds: arrayUnion(module.id),
      });

      toast({
        title: 'Success!',
        description: `Module "${module.name}" has been added to the space.`,
      });
      handleClose();
    } catch (error) {
      console.error('Error adding module to space:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to add module',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const handleClose = () => {
    form.reset();
    close();
  };
  
  const isLoading = userOrgsLoading || spacesLoading;

  return (
    <Dialog open={isDialogVisible} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Use "{module?.name}"</DialogTitle>
          <DialogDescription>
            Select a space to install this module into.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="spaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a compatible space..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>Loading spaces...</SelectItem>
                      ) : availableSpaces.length > 0 ? (
                        availableSpaces.map((space) => (
                          <SelectItem key={space.id} value={space.id}>
                            {space.name}
                          </SelectItem>
                        ))
                      ) : (
                         <SelectItem value="no-spaces" disabled>No compatible spaces found.</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || isLoading || availableSpaces.length === 0}>
                {form.formState.isSubmitting ? 'Adding...' : 'Add to Space'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
