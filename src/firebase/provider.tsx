'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth, User } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { app, auth, firestore, storage } from './index';

interface FirebaseContextState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsUserLoading(false);
        setUserError(null);
      },
      (error) => {
        setUser(null);
        setIsUserLoading(false);
        setUserError(error as Error);
      }
    );
    return () => unsubscribe();
  }, []);

  const value = useMemo((): FirebaseContextState => ({
    firebaseApp: app,
    firestore,
    auth,
    storage,
    user,
    isUserLoading,
    userError,
  }), [user, isUserLoading, userError]);

  return (
    <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
  );
}

export function useFirebase(): FirebaseContextState {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error('useFirebase must be used within a FirebaseProvider');
  return ctx;
}

export function useUser() {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
}

export function useAuthInstance() {
  const { auth } = useFirebase();
  return auth;
}

export function useFirestore() {
  const { firestore } = useFirebase();
  return firestore;
}