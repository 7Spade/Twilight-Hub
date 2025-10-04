/**
 * @fileoverview A dialog component for creating a new organization.
 * It uses a global Zustand store (`useDialogStore`) to control its visibility.
 * The form handles organization creation logic, including generating a URL slug,
 * checking for slug uniqueness, and creating both the organization account
 * and an initial audit log entry in a single Firestore batch write.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  collection,
  serverTimestamp,
  doc,
  writeBatch,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';

import { useFirestore, useUser } from '@/firebase';
import { useDialogState } from '@/hooks/use-app-state';
import { useToast } from '@/hooks/use-toast';
import { getPlaceholderImage } from '@/lib/placeholder-images';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const createOrgSchema = z.object({
  name: z.string().min(1, { message: 'Organization name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

type CreateOrgFormValues = z.infer<typeof createOrgSchema>;

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // replace multiple hyphens with a single one
};

export function CreateOrganizationDialog() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { type, isOpen, close } = useDialogState();
  const { toast } = useToast();

  const isDialogVisible = isOpen && type === 'createOrganization';

  const form = useForm<CreateOrgFormValues>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (values: CreateOrgFormValues) => {
    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to create an organization.',
      });
      return;
    }

    const orgSlug = generateSlug(values.name);
    const accountsRef = collection(firestore, 'accounts');

    // Check if an organization with the same slug already exists
    const q = query(
      accountsRef,
      where('slug', '==', orgSlug),
      where('type', '==', 'organization'),
      limit(1)
    );
    const existingOrgSnapshot = await getDocs(q);

    if (!existingOrgSnapshot.empty) {
      toast({
        variant: 'destructive',
        title: 'Organization Name Taken',
        description:
          'An organization with this name already exists. Please choose a different name.',
      });
      return;
    }

    try {
      const batch = writeBatch(firestore);
      const newOrgRef = doc(accountsRef); // Create a reference with a new ID

      const newOrg = {
        ...values,
        id: newOrgRef.id,
        type: 'organization',
        slug: orgSlug,
        ownerId: user.uid,
        memberIds: [user.uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      batch.set(newOrgRef, newOrg);

      const auditLogRef = doc(
        collection(firestore, `accounts/${newOrgRef.id}/audit_logs`)
      );
      const auditLog = {
        organizationId: newOrgRef.id,
        userId: user.uid,
        userName: user.displayName || 'Unnamed User',
        userAvatarUrl: user.photoURL || getPlaceholderImage('avatar-1').imageUrl,
        action: 'CREATE',
        entityType: 'ORGANIZATION',
        entityId: newOrgRef.id,
        entityTitle: values.name,
        createdAt: serverTimestamp(),
      };
      batch.set(auditLogRef, auditLog);

      await batch.commit();

      toast({
        title: 'Success!',
        description: `Organization "${values.name}" has been created.`,
      });

      form.reset();
      close();

      // Force a reload to the new organization's page to ensure all states are updated correctly.
      window.location.href = `/organizations/${orgSlug}`;
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create organization',
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
          <DialogTitle>Create a new organization</DialogTitle>
          <DialogDescription>
            Fill out the details below to get started.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
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
                      placeholder="A short description of your organization."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Creating...'
                  : 'Create Organization'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
