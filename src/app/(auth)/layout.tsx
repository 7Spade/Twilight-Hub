import { FirebaseProvider } from '@/firebase/provider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider>
      {children}
    </FirebaseProvider>
  );
}
