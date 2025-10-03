
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { useFirestore } from '@/firebase';
import { useDialogState } from '@/hooks/use-app-state';
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

const createItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  sku: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  lowStockThreshold: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().int().nonnegative('Threshold must be a non-negative number')
  ).optional(),
});

type CreateItemFormValues = z.infer<typeof createItemSchema>;

export function CreateItemDialog({ organizationId }: { organizationId: string }) {
  const firestore = useFirestore();
  const { type, isOpen, close } = useDialogState();
  const { toast } = useToast();

  const isDialogVisible = isOpen && type === 'createItem';

  const form = useForm<CreateItemFormValues>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      description: '',
      lowStockThreshold: 10,
    },
  });

  const onSubmit = async (values: CreateItemFormValues) => {
    if (!firestore) return;

    try {
      const itemsRef = collection(firestore, `accounts/${organizationId}/items`);
      await addDoc(itemsRef, {
        ...values,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Success!',
        description: `Item "${values.name}" has been created.`,
      });

      form.reset();
      close();
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create item',
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
          <DialogTitle>Add a new item</DialogTitle>
          <DialogDescription>
            Fill out the details for your new inventory item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput control={form.control} name="name" label="Item Name" placeholder="e.g. Hard Hat" />
            <div className="grid grid-cols-2 gap-4">
              <FormInput control={form.control} name="sku" label="SKU (Optional)" placeholder="e.g. HH-001" />
              <FormInput control={form.control} name="category" label="Category (Optional)" placeholder="e.g. Safety Gear" />
            </div>
            <FormTextarea control={form.control} name="description" label="Description (Optional)" placeholder="A brief description of the item." />
            <FormInput control={form.control} name="lowStockThreshold" label="Low Stock Alert" placeholder="10" type="number" />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
