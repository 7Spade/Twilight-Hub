'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, updateDoc, query, where, collection, getDocs, limit } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
} from '@/components/ui/form';
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
import { Skeleton } from '@/components/ui/skeleton';
import { PageContainer } from '@/components/layout/page-container';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormSwitch } from '@/components/forms/form-switch';

const spaceSettingsSchema = z.object({
  name: z.string().min(1, 'Space name is required'),
  description: z.string().min(1, 'Description is required'),
  isPublic: z.boolean().default(false),
});

type SpaceSettingsFormValues = z.infer<typeof spaceSettingsSchema>;

export default function OrgSpaceSettingsPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string, spaceslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const firestore = useFirestore();
  const { toast } = useToast();
  const [space, setSpace] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
    const fetchSpaceAndOrg = async () => {
        if (!firestore || !params.spaceslug || !params.organizationslug) return;
        setIsLoading(true);

        const orgsRef = collection(firestore, 'organizations');
        const orgQuery = query(orgsRef, where('slug', '==', params.organizationslug), limit(1));
        const orgSnapshot = await getDocs(orgQuery);
        let currentOrg = null;
        if (!orgSnapshot.empty) {
            currentOrg = { id: orgSnapshot.docs[0].id, ...orgSnapshot.docs[0].data() };
            setOrg(currentOrg);
        } else {
             setIsLoading(false);
             return;
        }

        const spacesRef = collection(firestore, 'spaces');
        const q = query(spacesRef, where('slug', '==', params.spaceslug), where('ownerId', '==', currentOrg.id), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const spaceDoc = querySnapshot.docs[0];
            setSpace({ id: spaceDoc.id, ...spaceDoc.data() });
        } else {
            setSpace(null);
        }
        setIsLoading(false);
    }
    fetchSpaceAndOrg();
  }, [firestore, params.spaceslug, params.organizationslug]);

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
              <Link href="/organizations">Organizations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
           <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/organizations/${params.organizationslug}`}>{isLoading ? '...' : org?.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
             <BreadcrumbLink asChild>
                <Link href={`/organizations/${params.organizationslug}/${params.spaceslug}`}>{isLoading ? '...' : space?.name}</Link>
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
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Update your space's name, description, and visibility.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="space-y-8">
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-1/4" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}
