'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, updateDoc, query, where, collection, getDocs, limit } from 'firebase/firestore';

import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { PageContainer } from '@/components/layout/page-container';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormSwitch } from '@/components/forms/form-switch';
import { FormCard } from '@/components/forms/form-card';
import { type Space } from '@/lib/types';

const spaceSettingsSchema = z.object({
  name: z.string().min(1, 'Space name is required'),
  description: z.string().min(1, 'Description is required'),
  isPublic: z.boolean().default(false),
});

type SpaceSettingsFormValues = z.infer<typeof spaceSettingsSchema>;

export default function SpaceSettingsPage({
  params: paramsPromise,
}: {
  params: Promise<{ userslug: string, spaceslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const firestore = useFirestore();
  const { toast } = useToast();
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpace = async () => {
        if (!firestore || !params.spaceslug) return;
        setIsLoading(true);
        const spacesRef = collection(firestore, 'spaces');
        const q = query(spacesRef, where('slug', '==', params.spaceslug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const spaceDoc = querySnapshot.docs[0];
            setSpace({ id: spaceDoc.id, ...spaceDoc.data() } as Space);
        } else {
            setSpace(null);
        }
        setIsLoading(false);
    }
    fetchSpace();
  }, [firestore, params.spaceslug]);

  const spaceDocRef = useMemo(
    () => (firestore && space ? doc(firestore, 'spaces', space.id) : null),
    [firestore, space]
  );

  const form = useForm<SpaceSettingsFormValues>({
    resolver: zodResolver(spaceSettingsSchema),
    defaultValues: {
      name: '',
      description: '',
      isPublic: false,
    },
  });

  useEffect(() => {
    if (space) {
      form.reset({
        name: space.name || '',
        description: space.description || '',
        isPublic: space.isPublic || false,
      });
    }
  }, [space, form]);

  const onSubmit = async (data: SpaceSettingsFormValues) => {
    if (!spaceDocRef) return;
    try {
      await updateDoc(spaceDocRef, data);
      toast({
        title: 'Success!',
        description: 'Space settings have been updated.',
      });
    } catch (error) {
      console.error('Error updating space:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update space settings.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/spaces">Spaces</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
             <BreadcrumbLink asChild>
                <Link href={`/${params.userslug}/${params.spaceslug}`}>{isLoading ? '...' : space?.name}</Link>
             </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <PageContainer
        title="Space Settings"
        description={`Manage settings for ${isLoading ? '...' : `"${space?.name}"`}.`}
      >
        <FormCard
          title="General Settings"
          description="Update your space's name, description, and visibility."
          isLoading={isLoading}
          form={form}
          onSubmit={onSubmit}
        >
          <FormInput
            control={form.control}
            name="name"
            label="Space Name"
            placeholder="Project Phoenix"
          />
          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="A short description of the space's purpose."
          />
          <FormSwitch
            control={form.control}
            name="isPublic"
            label="Public Space"
            description="If enabled, anyone can discover and view this space."
          />
        </FormCard>
      </PageContainer>
    </div>
  );
}
