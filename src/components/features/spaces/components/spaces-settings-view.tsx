/**
 * @fileoverview A component for displaying and editing the settings of a space.
 * It provides a form to update the space's name, description, and visibility (public/private).
 * This component is typically used within a "Settings" tab on a space detail page.
 */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormCard } from '@/components/forms/form-card';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormSwitch } from '@/components/forms/form-switch';
import { type Space } from '@/lib/types';
import { spaceBaseSchema, type SpaceBaseFormValues } from '@/components/features/spaces/spaces-schemas';

export type SpaceSettingsFormValues = SpaceBaseFormValues;

interface SpaceSettingsViewProps {
  space: Space | null;
  isLoading: boolean;
  onFormSubmit: (values: SpaceSettingsFormValues) => Promise<void>;
  breadcrumbs?: React.ReactNode;
}

export function SpaceSettingsView({
  space,
  isLoading,
  onFormSubmit,
  breadcrumbs,
}: SpaceSettingsViewProps) {
  const form = useForm<SpaceSettingsFormValues>({
    resolver: zodResolver(spaceBaseSchema),
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
    <div className="flex flex-col gap-8">
      {breadcrumbs}
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
    </div>
  );
}
