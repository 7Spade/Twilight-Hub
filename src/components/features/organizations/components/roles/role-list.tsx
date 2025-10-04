'use client';

import React, { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Role = {
  id: string;
  name?: string;
  description?: string;
  isDefault?: boolean;
};

export function RoleList({ organizationId, canManage = false }: { organizationId: string; canManage?: boolean }) {
  const db = useFirestore();

  const rolesRef = useMemo(() => {
    if (!db || !organizationId) return null;
    return collection(db, 'accounts', organizationId, 'roles');
  }, [db, organizationId]);

  const { data: roles, loading, error } = useCollection<Role>(rolesRef as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Loading roles...</p>}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
        {!loading && !error && (!roles || roles.length === 0) && (
          <p className="text-sm text-muted-foreground">No roles defined.</p>
        )}
        {!loading && !error && roles && roles.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">{canManage ? 'Actions' : ''}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name || r.id}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell className="text-right">
                    {canManage ? (
                      <span className="text-xs text-muted-foreground">Edit · Delete</span>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}


