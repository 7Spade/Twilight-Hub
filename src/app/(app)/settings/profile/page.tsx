'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, updateDoc } from 'firebase/firestore';

import { useFirestore, useUser, useDoc } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormCard } from '@/components/forms/form-card';
import { type Account } from '@/lib/types-unified';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  bio: z.string().max(160, 'Bio cannot be longer than 160 characters').optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileSettingsPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemo(() => 
    (firestore && user ? doc(firestore, 'accounts', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<Account>(userProfileRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      username: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        username: userProfile.username || '',
        bio: userProfile.bio || '',
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !userProfileRef) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }

    try {
      // Update Firestore document
      await updateDoc(userProfileRef, {
        name: data.name,
        username: data.username,
        bio: data.bio,
      });

      // Also update Firebase Auth profile if the name has changed
      if (user.displayName !== data.name) {
        await updateProfile(user, { displayName: data.name });
      }

      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update your profile. Please try again.',
      });
    }
  };
  
  const isLoading = isAuthLoading || isProfileLoading;

  return (
      <FormCard
        title="Public Profile"
        description="This information will be displayed publicly."
        isLoading={isLoading}
        form={form}
        onSubmit={onSubmit}
      >
        <FormInput
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="Your full name"
        />
        <FormInput
            control={form.control}
            name="username"
            label="Username"
            placeholder="Your username"
            disabled // Usually, username is not easily changed
        />
        <FormTextarea
            control={form.control}
            name="bio"
            label="Bio"
            placeholder="Tell us a little bit about yourself"
        />
      </FormCard>
  );
}
