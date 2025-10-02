'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, serverTimestamp, doc, writeBatch } from 'firebase/firestore';

import { useFirestore, useUser } from '@/firebase';
import { useDialogStore } from '@/hooks/use-dialog-store';
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
  const { type, isOpen, close } = useDialogStore();
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

    try {
      const batch = writeBatch(firestore);
      const orgsRef = collection(firestore, 'organizations');
      const newOrgRef = doc(orgsRef); // Create a reference with a new ID

      const newOrg = {
        ...values,
        id: newOrgRef.id,
        slug: generateSlug(values.name),
        ownerId: user.uid,
        memberIds: [user.uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      batch.set(newOrgRef, newOrg);

      const auditLogRef = doc(collection(firestore, `organizations/${newOrgRef.id}/audit_logs`));
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
                {form.formState.isSubmitting ? 'Creating...' : 'Create Organization'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
