export type FirebaseErrorInfo = {
  code: string;
  message: string;
};

export const FIREBASE_GENERIC_ERROR: FirebaseErrorInfo = {
  code: 'firebase/error',
  message: 'Unexpected Firebase error',
};