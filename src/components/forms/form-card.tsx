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
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';

interface FormCardProps {
  title: string;
  description: string;
  isLoading: boolean;
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  children: React.ReactNode;
}

export function FormCard({
  title,
  description,
  isLoading,
  form,
  onSubmit,
  children,
}: FormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            {isLoading ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
                 <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ) : (
              <div className="space-y-8">{children}</div>
            )}
          </CardContent>
          <CardFooter>
            {!isLoading && (
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
