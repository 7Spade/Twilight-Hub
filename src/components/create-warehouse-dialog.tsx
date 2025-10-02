
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput } from './forms/form-input';
import { FormTextarea } from './forms/form-textarea';

const createWarehouseSchema = z.object({
  name: z.string().min(1, 'Warehouse name is required'),
  location: z.string().min(1, 'Location is required'),
});

type CreateWarehouseFormValues = z.infer<typeof createWarehouseSchema>;

export function CreateWarehouseDialog({ organizationId }: { organizationId: string }) {
  const firestore = useFirestore();
  const { type, isOpen, close } = useDialogStore();
  const { toast } = useToast();

  const isDialogVisible = isOpen && type === 'createWarehouse';

  const form = useForm<CreateWarehouseFormValues>({
    resolver: zodResolver(createWarehouseSchema),
    defaultValues: {
      name: '',
      location: '',
    },
  });

  const onSubmit = async (values: CreateWarehouseFormValues) => {
    if (!firestore) return;

    try {
      const warehousesRef = collection(firestore, `accounts/${organizationId}/warehouses`);
      await addDoc(warehousesRef, {
        ...values,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Success!',
        description: `Warehouse "${values.name}" has been created.`,
      });

      form.reset();
      close();
    } catch (error) {
      console.error('Error creating warehouse:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create warehouse',
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
          <DialogTitle>Add a new warehouse</DialogTitle>
          <DialogDescription>
            Add a new location to store your inventory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput control={form.control} name="name" label="Warehouse Name" placeholder="e.g. Main Depot" />
            <FormTextarea control={form.control} name="location" label="Location" placeholder="e.g. 123 Main St, Anytown, USA" />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Warehouse'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
