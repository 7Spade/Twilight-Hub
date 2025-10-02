/**
 * @fileoverview A reusable form textarea component.
 * It integrates a standard `Textarea` with `react-hook-form`'s `FormField`
 * to provide a multi-line text input with validation and state management.
 * It handles displaying labels, descriptions, and error messages.
 */

'use client';

import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea, type TextareaProps } from '@/components/ui/textarea';

interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends TextareaProps {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
}

export function FormTextarea<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  ...props
}: FormTextareaProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} {...props} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
