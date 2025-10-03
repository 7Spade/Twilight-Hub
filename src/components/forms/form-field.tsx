/**
 * @fileoverview 統�??�表?��?段�?�?
 * ?��? form-input, form-switch, form-textarea ?��???
 * ?�循奧卡姆�??�?��?，�?供�?簡�??�實??
 */

'use client';

import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// 表單字段類�?定義
export type FormFieldType = 'input' | 'textarea' | 'switch';

// ?��?表單字段屬�?
interface BaseFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

// 輸入框特定屬??
interface InputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type: 'input';
  inputType?: 'text' | 'email' | 'password' | 'number' | 'url';
  placeholder?: string;
}

// ?�本?�?�特定屬??
interface TextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type: 'textarea';
  placeholder?: string;
  rows?: number;
}

// ?��??��?屬�?
interface SwitchFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type: 'switch';
}

// ?��?類�?
export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = InputFieldProps<TFieldValues, TName> | TextareaFieldProps<TFieldValues, TName> | SwitchFieldProps<TFieldValues, TName>;

/**
 * 統�??�表?��?段�?�?
 * ?��?輸入框、�??��??��??��?三種類�?
 */
export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  disabled = false,
  ...props
}: FormFieldProps<TFieldValues>) {
  const field = control._formValues[name as string];

  const renderField = () => {
    switch (props.type) {
      case 'input':
        return (
          <Input
            {...control.register(name)}
            type={props.inputType || 'text'}
            placeholder={props.placeholder}
            disabled={disabled}
            className={cn(
              'transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...control.register(name)}
            placeholder={props.placeholder}
            rows={props.rows || 3}
            disabled={disabled}
            className={cn(
              'transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          />
        );

      case 'switch':
        return (
          <Switch
            {...control.register(name)}
            checked={field}
            disabled={disabled}
            className={cn(
              'transition-colors',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="space-y-1">
        <Label 
          htmlFor={name}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            disabled && 'opacity-50'
          )}
        >
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {renderField()}
    </div>
  );
}

// 導出便捷?��??��?組件
export const FormInput = <TFieldValues extends FieldValues>(
  props: Omit<InputFieldProps<TFieldValues>, 'type'>
) => <FormField {...props} type="input" />;

export const FormTextarea = <TFieldValues extends FieldValues>(
  props: Omit<TextareaFieldProps<TFieldValues>, 'type'>
) => <FormField {...props} type="textarea" />;

export const FormSwitch = <TFieldValues extends FieldValues>(
  props: Omit<SwitchFieldProps<TFieldValues>, 'type'>
) => <FormField {...props} type="switch" />;
