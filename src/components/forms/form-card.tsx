/**
 * @fileoverview A reusable card component for forms.
 * It wraps a react-hook-form instance, handling submission logic,
 * loading states, and providing a consistent layout with a card,
 * header, content, and a submit button in the footer.
 */

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// TODO: [P2] REFACTOR src/components/forms/form-card.tsx:18 - 清理未使用的導入
// 問題：'Skeleton' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { FormCardSkeleton } from '../form-card-skeleton';

interface FormCardProps<T extends FieldValues> {
  title: string;
  description: string;
  isLoading: boolean;
  form: UseFormReturn<T>;
  onSubmit: (values: T) => Promise<void>;
  children: React.ReactNode;
}

export function FormCard<T extends FieldValues>({
  title,
  description,
  isLoading,
  form,
  onSubmit,
  children,
}: FormCardProps<T>) {

  if (isLoading) {
    return <FormCardSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
         <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">{children}</div>
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardFooter>
          </Card>
      </form>
    </Form>
  );
}
