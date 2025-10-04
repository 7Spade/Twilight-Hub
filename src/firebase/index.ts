import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };

// Convenience re-exports for hooks and provider
export {
  FirebaseProvider,
  useFirebase,
  useUser,
  useAuthInstance,
  useFirestore,
} from './provider';

export { default as default } from './config';

// Auth service
export { AuthService, type UserProfile } from './auth';

// Firestore React hooks
export { default as useCollection } from './firestore/use-collection';
export { default as useDoc } from './firestore/use-doc';