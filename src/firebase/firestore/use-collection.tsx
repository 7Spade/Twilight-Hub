'use client';

import { useEffect, useState } from 'react';
import { getDocs, Query, CollectionReference } from 'firebase/firestore';

export function useCollection<T>(target: Query<T> | CollectionReference<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!target) return;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const snap = await getDocs(target as any);
        setData(snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as T[]);
      } catch (e) {
        setError(e as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [target]);

  return { data, loading, error } as const;
}