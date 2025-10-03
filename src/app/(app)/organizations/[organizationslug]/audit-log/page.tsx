'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { useFirestore } from '@/firebase/provider';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

type Org = { id: string; name?: string };
type AuditLog = {
  id: string;
  action?: string;
  entityTitle?: string;
  userName?: string;
  createdAt?: { seconds: number; nanoseconds: number } | Date;
};

export default function OrgAuditLogPage() {
  const params = useParams();
  const slug = (params?.organizationslug as string) || '';
  const db = useFirestore();

  const [org, setOrg] = useState<Org | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const orgSnap = await getDocs(orgQ);
        if (orgSnap.empty) {
          setOrg(null);
          setLogs([]);
          setLoading(false);
          return;
        }
        const orgDoc = orgSnap.docs[0];
        const nextOrg: Org = { id: orgDoc.id, ...(orgDoc.data() as any) };
        setOrg(nextOrg);

        const logsQ = query(
          collection(db, 'audit_logs'),
          where('organizationId', '==', nextOrg.id),
          orderBy('createdAt', 'desc'),
          limit(25)
        );
        const logsSnap = await getDocs(logsQ);
        const rows: AuditLog[] = logsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        setLogs(rows);
      } catch (e: any) {
        setError(e?.message || 'Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [db, slug]);

  return (
    <PageContainer title="Audit Log" description={org?.name || slug}>
      {loading && <p>Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && logs.length === 0 && (
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      )}
      {!loading && logs.length > 0 && (
        <ul className="space-y-2">
          {logs.map(log => (
            <li key={log.id} className="text-sm">
              <span className="font-medium">{log.userName || 'Someone'}</span>
              <span> </span>
              <span className="text-muted-foreground">{log.action || 'ACTION'}</span>
              <span> on </span>
              <span className="font-medium">{log.entityTitle || log.id}</span>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
