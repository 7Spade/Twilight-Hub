/**
 * @fileoverview çµ±ä??„è¡¨?®å?æ®µç?ä»?
 * ?´å? form-input, form-switch, form-textarea ?„å???
 * ?µå¾ªå¥§å¡å§†å??€?Ÿå?ï¼Œæ?ä¾›æ?ç°¡æ??„å¯¦??
 */

'use client';

import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// è¡¨å–®å­—æ®µé¡å?å®šç¾©
export type FormFieldType = 'input' | 'textarea' | 'switch';

// ?ºç?è¡¨å–®å­—æ®µå±¬æ€?
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

// è¼¸å…¥æ¡†ç‰¹å®šå±¬??
interface InputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type: 'input';
  inputType?: 'text' | 'email' | 'password' | 'number' | 'url';
  placeholder?: string;
}

// ?‡æœ¬?€?Ÿç‰¹å®šå±¬??
interface TextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type: 'textarea';
  placeholder?: string;
  rows?: number;
}

// ?‹é??¹å?å±¬æ€?
interface SwitchFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type: 'switch';
}

// ?¯å?é¡å?
export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = InputFieldProps<TFieldValues, TName> | TextareaFieldProps<TFieldValues, TName> | SwitchFieldProps<TFieldValues, TName>;

/**
 * çµ±ä??„è¡¨?®å?æ®µç?ä»?
 * ?¯æ?è¼¸å…¥æ¡†ã€æ??¬å??Ÿå??‹é?ä¸‰ç¨®é¡å?
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

// å°å‡ºä¾¿æ·?„é??‹å?çµ„ä»¶
export const FormInput = <TFieldValues extends FieldValues>(
  props: Omit<InputFieldProps<TFieldValues>, 'type'>
) => <FormField {...props} type="input" />;

export const FormTextarea = <TFieldValues extends FieldValues>(
  props: Omit<TextareaFieldProps<TFieldValues>, 'type'>
) => <FormField {...props} type="textarea" />;

export const FormSwitch = <TFieldValues extends FieldValues>(
  props: Omit<SwitchFieldProps<TFieldValues>, 'type'>
) => <FormField {...props} type="switch" />;
