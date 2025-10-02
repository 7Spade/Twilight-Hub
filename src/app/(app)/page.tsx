'use client';
import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';

export default function AppRootPage() {
    const { user, isUserLoading } = useUser();

    // Redirect to dashboard by default for authenticated users
    // This could be customized based on user roles or preferences in the future
    if (!isUserLoading && user) {
        redirect('/dashboard');
    }
    
    // If user is not logged in, they might be attempting to access a public profile
    // The actual rendering/redirecting for that will be handled by the [userslug] page.
    // For the root app page, if we're still loading or the user is null, we can show a loader
    // or just let the specific route handlers do their job.
    // A simple loader is fine here.
    if (isUserLoading) {
        return <div>Loading...</div>;
    }
    
    // If not loading and no user, they should be at the public landing page,
    // but since this is the (app) group, we redirect to login.
    redirect('/login');
}
