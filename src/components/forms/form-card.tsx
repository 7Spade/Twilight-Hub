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
// TODO: [P1] VAN - 移除未使用的重命名導入
// 問題：Skeleton 導入後從未使用
// 解決方案：直接移除未使用的導入語句
// 現代化建議：使用 ESLint no-unused-vars 規則自動檢測
// 效能影響：減少 bundle 大小，降低認知負擔，提升 AI agent 代碼理解
// 相關受影響檔案：無（這個導入未在任何地方使用）

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
