'use client';

import { useEffect, useState } from 'react';
import { getDoc, DocumentReference } from 'firebase/firestore';

export function useDoc<T>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) return;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const snap = await getDoc(ref as any);
        setData((snap.exists() ? ({ id: snap.id, ...(snap.data() as any) } as T) : null));
      } catch (e) {
        setError(e as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [ref]);

  return { data, loading, error } as const;
}