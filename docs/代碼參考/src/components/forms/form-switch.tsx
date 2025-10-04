/**
 * @fileoverview A reusable form switch component.
 * It integrates a `Switch` with `react-hook-form`'s `FormField`
 * to provide a toggle input with validation and state management.
 * It handles displaying labels and descriptions within a bordered item.
 */

'use client';

import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch, type SwitchProps } from '@/components/ui/switch';

interface FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends SwitchProps {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
}

export function FormSwitch<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  ...props
}: FormSwitchProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              {...props}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
