'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateProfile, UserCredential, AuthError } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { useAuth, useUser } from '@/firebase';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import {
  collection,
  serverTimestamp,
  setDoc,
  doc,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from 'react';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';


const signupSchema = z.object({
  fullName: z.string().min(1, { message: 'Please enter your full name' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }).regex(/^[a-z0-9-]+$/, 'Username can only contain lowercase letters, numbers, and hyphens.'),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric characters except spaces and hyphens
      .trim()
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // replace multiple hyphens with a single one
};


function SignupPageContent() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    if (!auth || !firestore) {
        toast({
          variant: 'destructive',
          title: 'Initialization Error',
          description: 'Firebase is not ready. Please try again in a moment.',
        });
        return;
    }

    try {
        // Check if username already exists
        const accountsRef = collection(firestore, 'accounts');
        const q = query(accountsRef, where('type', '==', 'user'), where('username', '==', values.username), limit(1));
        const usernameSnapshot = await getDocs(q);

        if (!usernameSnapshot.empty) {
            toast({
                variant: 'destructive',
                title: 'Username Taken',
                description: 'This username is already in use. Please choose another one.',
            });
            return;
        }

        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const newUser = userCredential.user;

        await updateProfile(newUser, {
            displayName: values.fullName,
        });

        const userAccount = {
            id: newUser.uid,
            type: 'user',
            username: values.username,
            slug: generateSlug(values.username),
            name: values.fullName,
            email: newUser.email,
            avatarUrl: newUser.photoURL || getPlaceholderImage('avatar-1').imageUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            level: 1,
            experience: 0,
            managementScore: 0,
            followersCount: 0,
            followingCount: 0,
            moduleInventory: {},
        };

        const userDocRef = doc(firestore, 'accounts', newUser.uid);
        await setDoc(userDocRef, userAccount);
        
        router.push('/dashboard');
        
    } catch (error) {
      const authError = error as AuthError;
        console.error("Error during sign up:", authError);
        let description = "An unexpected error occurred. Please try again.";
        if (authError.code === 'auth/email-already-in-use') {
            description = "This email address is already in use. Please use a different email or log in.";
        }
        toast({
          variant: "destructive",
          title: "Sign-up Failed",
          description: description,
        });
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-block">
            <Logo />
          </Link>          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Join Twilight Hub and start collaborating.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function SignupPage() {
    return (
        <FirebaseClientProvider>
            <SignupPageContent />
        </FirebaseClientProvider>
    )
}
