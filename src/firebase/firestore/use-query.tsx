'use client';

import { useEffect, useState } from 'react';
import { getDocs, Query } from 'firebase/firestore';

export function useQuery<T>(q: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) return;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const snap = await getDocs(q as any);
        setData(snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as T[]);
      } catch (e) {
        setError(e as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [q]);

  return { data, loading, error } as const;
}