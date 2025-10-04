'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { useFirestore } from '@/firebase/provider';
import { collection, doc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

type Org = { id: string; name?: string; description?: string };

export default function OrgSettingsPage() {
  const params = useParams();
  const slug = (params?.organizationslug as string) || '';
  const db = useFirestore();

  const [org, setOrg] = useState<Org | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<{ name: string; description: string }>({
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (!db || !slug) return;
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const orgQ = query(
          collection(db, 'accounts'),
          where('type', '==', 'organization'),
          where('slug', '==', slug),
          limit(1)
        );
        const snap = await getDocs(orgQ);
        if (snap.empty) {
          setOrg(null);
          setLoading(false);
          return;
        }
        const d = snap.docs[0];
        const nextOrg: Org = { id: d.id, ...(d.data() as any) };
        setOrg(nextOrg);
        form.reset({ name: nextOrg.name || '', description: nextOrg.description || '' });
      } catch (e: any) {
        setError(e?.message || 'Failed to load organization');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [db, slug]);

  const onSubmit = async (values: { name: string; description: string }) => {
    if (!db || !org) return;
    try {
      await updateDoc(doc(db, 'accounts', org.id), values);
    } catch (e) {
      // keep minimal: surface generic error only
      setError('Failed to update settings');
    }
  };

  return (
    <PageContainer title="Organization Settings" description={org?.name || slug}>
      {loading && <p>Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && org && (
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput control={form.control} name={'name' as any} label="Name" placeholder="Organization name" />
          <FormTextarea control={form.control} name={'description' as any} label="Description" placeholder="About this organization" />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </form>
      )}
    </PageContainer>
  );
}

/**
 * 組織設定頁面
 * 
 * 功能：
 * - 組織基本設定
 * - 組織信息編輯
 * - 組織偏好設定
 * - 組織安全設定
 * 
 * 路由：/organizations/[organizationslug]/settings
 * 組件類型：Client Component
 */