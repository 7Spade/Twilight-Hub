'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  limit,
  getDoc,
} from 'firebase/firestore';

import { useFirestore } from '@/firebase';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const inviteMemberSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

export function InviteMemberDialog({ organizationId }: { organizationId: string }) {
  const firestore = useFirestore();
  const { type, isOpen, close } = useDialogStore();
  const { toast } = useToast();

  const isDialogVisible = isOpen && type === 'inviteMember';

  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: InviteMemberFormValues) => {
    if (!firestore) return;

    try {
      // 1. Find user by email
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', values.email), limit(1));
      const userSnapshot = await getDocs(q);

      if (userSnapshot.empty) {
        toast({
          variant: 'destructive',
          title: 'User not found',
          description: `No user with the email ${values.email} exists.`,
        });
        return;
      }

      const userToInvite = userSnapshot.docs[0];
      const userId = userToInvite.id;
      const orgDocRef = doc(firestore, 'organizations', organizationId);
      const orgDoc = await getDoc(orgDocRef);

      // 2. Check if user is already a member
      if (orgDoc.exists() && orgDoc.data().memberIds?.includes(userId)) {
         toast({
          variant: 'destructive',
          title: 'Already a member',
          description: `${values.email} is already in this organization.`,
        });
        return;
      }

      // 3. Add user to organization
      await updateDoc(orgDocRef, {
        memberIds: arrayUnion(userId),
      });

      toast({
        title: 'Success!',
        description: `${userToInvite.data().name} has been added to the organization.`,
      });

      form.reset();
      close();
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to invite member',
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
          <DialogTitle>Invite a new member</DialogTitle>
          <DialogDescription>
            Enter the email of the person you want to add to this organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="member@example.com" {...field} />
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
                {form.formState.isSubmitting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
