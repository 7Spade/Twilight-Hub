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

const orgSettingsSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().min(1, 'Description is required'),
});

type OrgSettingsFormValues = z.infer<typeof orgSettingsSchema>;

export default function OrgSettingsPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const firestore = useFirestore();
  const { toast } = useToast();
  const [org, setOrg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
    const fetchOrg = async () => {
        if (!firestore || !params.organizationslug) return;
        setIsLoading(true);

        const orgsRef = collection(firestore, 'organizations');
        const orgQuery = query(orgsRef, where('slug', '==', params.organizationslug), limit(1));
        const orgSnapshot = await getDocs(orgQuery);

        if (!orgSnapshot.empty) {
            const orgDoc = orgSnapshot.docs[0];
            setOrg({ id: orgDoc.id, ...orgDoc.data() });
        } else {
            setOrg(null);
        }
        setIsLoading(false);
    }
    fetchOrg();
  }, [firestore, params.organizationslug]);

  const orgDocRef = useMemo(
    () => (firestore && org ? doc(firestore, 'organizations', org.id) : null),
    [firestore, org]
  );

  const form = useForm<OrgSettingsFormValues>({
    resolver: zodResolver(orgSettingsSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (org) {
      form.reset({
        name: org.name || '',
        description: org.description || '',
      });
    }
  }, [org, form]);

  const onSubmit = async (data: OrgSettingsFormValues) => {
    if (!orgDocRef) return;
    try {
      await updateDoc(orgDocRef, data);
      toast({
        title: 'Success!',
        description: 'Organization settings have been updated.',
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update organization settings.',
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
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <PageContainer
        title="Organization Settings"
        description={`Manage settings for ${isLoading ? '...' : `"${org?.name}"`}.`}
      >
        <FormCard
          title="General Settings"
          description="Update your organization's name and description."
          isLoading={isLoading}
          form={form}
          onSubmit={onSubmit}
        >
            <FormInput
                control={form.control}
                name="name"
                label="Organization Name"
                placeholder="Your organization's name"
            />
            <FormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="A short description of your organization."
            />
        </FormCard>
      </PageContainer>
    </div>
  );
}
