'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormCard } from '@/components/forms/form-card';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormSwitch } from '@/components/forms/form-switch';
import { type Space } from '@/lib/types';

const spaceSettingsSchema = z.object({
  name: z.string().min(1, 'Space name is required'),
  description: z.string().min(1, 'Description is required'),
  isPublic: z.boolean().default(false),
});

export type SpaceSettingsFormValues = z.infer<typeof spaceSettingsSchema>;

interface SpaceSettingsViewProps {
  space: Space | null;
  isLoading: boolean;
  onFormSubmit: (values: SpaceSettingsFormValues) => Promise<void>;
}

export function SpaceSettingsView({
  space,
  isLoading,
  onFormSubmit,
}: SpaceSettingsViewProps) {
  const form = useForm<SpaceSettingsFormValues>({
    resolver: zodResolver(spaceSettingsSchema),
    defaultValues: {
      name: '',
      description: '',
      isPublic: false,
    },
  });

  React.useEffect(() => {
    if (space) {
      form.reset({
        name: space.name || '',
        description: space.description || '',
        isPublic: space.isPublic || false,
      });
    }
  }, [space, form]);

  return (
    <FormCard
      title="General Settings"
      description="Update your space's name, description, and visibility."
      isLoading={isLoading}
      form={form}
      onSubmit={onFormSubmit}
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
  );
}
