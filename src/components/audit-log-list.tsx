'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

import { useFirestore, useCollection } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

function generateLogMessage(log: any) {
  const actionText = log.action.toLowerCase();
  const entityType = log.entityType.toLowerCase();

  switch (log.entityType) {
    case 'ORGANIZATION':
      return `created the organization.`;
    case 'ITEM':
      return `${actionText} the item "${log.entityTitle}".`;
    case 'MEMBER':
      return `${actionText} a member.`;
    default:
      return `${actionText} a ${entityType} named "${log.entityTitle}".`;
  }
}

function AuditLogSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-64 rounded" />
                        <Skeleton className="h-3 w-24 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function AuditLogList({ organizationId }: { organizationId: string }) {
  const firestore = useFirestore();

  const auditLogsQuery = useMemo(
    () =>
      firestore
        ? query(
            collection(firestore, `organizations/${organizationId}/audit_logs`),
            orderBy('createdAt', 'desc'),
            limit(50)
          )
        : null,
    [firestore, organizationId]
  );

  const { data: logs, isLoading } = useCollection(auditLogsQuery);

  if (isLoading) {
    return <AuditLogSkeleton />;
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No audit log entries yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={log.userAvatarUrl} alt={log.userName} />
            <AvatarFallback>{log.userName?.[0].toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-semibold">{log.userName}</span>{' '}
              {generateLogMessage(log)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(log.createdAt.toDate(), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
