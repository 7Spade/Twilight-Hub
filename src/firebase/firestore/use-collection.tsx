'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 * 
 * @template T Optional type for document data. Defaults to DocumentData.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * The Firestore CollectionReference or Query. Waits if null/undefined.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
// TODO: [P2] REFACTOR src/firebase/firestore/use-collection.tsx - 控制快取與依賴穩定，降低重新訂閱
// 建議：
// - 呼叫端須 useMemo 穩定 Query/Ref，hook 內可檢查相等性避免過度 unsubscribe/subscribe。
// - 提供選項：{ listen?: boolean; cache?: 'no-store'|'memory' }，與 App Router 快取策略對齊。
// - 僅回傳必要欄位，錯誤統一由 errorEmitter 傳遞。
export function useCollection<T = DocumentData>(
    targetRefOrQuery: CollectionReference<DocumentData> | Query<DocumentData> | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Default to true
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!targetRefOrQuery) {
      setData(null);
      setIsLoading(false); // Not loading if there's no query
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      targetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = snapshot.docs.map(doc => ({
          ...(doc.data() as T),
          id: doc.id
        }));
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (err: FirestoreError) => { /* TODO: [P3] REFACTOR src/firebase/firestore/use-collection.tsx - 清理未使用的參數 */
        let path: string;
        if (targetRefOrQuery.type === 'collection') {
          path = (targetRefOrQuery as CollectionReference).path;
        } else {
          // A simplified way to get path from a query. 
          // Note: This might not represent complex queries perfectly but is good for most cases.
          path = (targetRefOrQuery as Query)._query.path.toString();
        }

        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        })

        console.error("useCollection error:", contextualError);
        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [targetRefOrQuery]);

  return { data, isLoading, error };
}
