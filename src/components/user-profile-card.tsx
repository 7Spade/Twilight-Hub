'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Mail, Smile, Users } from 'lucide-react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { type Account } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

const achievements = [
    { id: 'yolo', image: getPlaceholderImage('achievement-1').imageUrl, hint: getPlaceholderImage('achievement-1').imageHint },
    { id: 'shark', image: getPlaceholderImage('achievement-2').imageUrl, hint: getPlaceholderImage('achievement-2').imageHint },
    { id: 'cowboy', image: getPlaceholderImage('achievement-3').imageUrl, hint: getPlaceholderImage('achievement-3').imageHint },
];

const organizations = [
    { id: 'org1', image: getPlaceholderImage('org-logo-1').imageUrl, hint: getPlaceholderImage('org-logo-1').imageHint },
    { id: 'org2', image: getPlaceholderImage('org-logo-2').imageUrl, hint: getPlaceholderImage('org-logo-2').imageHint },
]

export function UserProfileCard() {
    const { user: authUser, isUserLoading: isAuthLoading } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemo(() => 
        (firestore && authUser ? doc(firestore, 'accounts', authUser.uid) : null),
        [firestore, authUser]
    );
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<Account>(userProfileRef);

    const isLoading = isAuthLoading || isProfileLoading;

    if (isLoading || !userProfile || !authUser) {
        return (
            <Card className="w-full max-w-xs">
                <CardContent className="p-6 flex flex-col items-center gap-4">
                    <Skeleton className="w-32 h-32 rounded-full" />
                    <div className="text-center space-y-2">
                        <Skeleton className="h-7 w-32" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <div className="flex flex-col gap-2 w-full">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                </CardContent>
            </Card>
        );
    }
    
  const user = {
    name: userProfile.name || 'User',
    username: userProfile.username || 'username',
    avatarUrl: userProfile.avatarUrl || getPlaceholderImage('avatar-1').imageUrl,
    followers: userProfile.followersCount || 0,
    following: userProfile.followingCount || 0,
    email: userProfile.email || 'user@example.com',
  };

  const fallbackText = user.name.charAt(0) || 'U';

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-muted text-5xl font-bold">
              {fallbackText}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 bg-muted rounded-full p-1">
            <Smile className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        <Button variant="outline" className="w-full">
          Edit profile
        </Button>

        <div className='flex flex-col gap-2 w-full text-sm text-muted-foreground'>
            <div className="flex items-center gap-4">
                <div className='flex items-center gap-1'>
                    <Users className="h-4 w-4" />
                    <span className="font-bold text-foreground">{user.followers}</span> follower
                </div>
                <span className='font-bold text-foreground'>·</span>
                <div>
                    <span className="font-bold text-foreground">{user.following}</span> following
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
            </div>
        </div>

        <Separator className="my-2" />

        <div className="w-full">
            <h3 className="font-semibold text-foreground mb-3">Achievements</h3>
            <div className="flex items-center gap-3">
                {achievements.map((ach) => (
                    <Avatar key={ach.id} className="h-12 w-12 border-2 border-border">
                        <AvatarImage src={ach.image} alt={ach.id} data-ai-hint={ach.hint} />
                        <AvatarFallback>{ach.id.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
        </div>

        <Separator className="my-2" />

        <div className="w-full">
            <h3 className="font-semibold text-foreground mb-3">Organizations</h3>
             <div className="flex items-center gap-3">
                {organizations.map((org) => (
                    <Avatar key={org.id} className="h-10 w-10 rounded-md border-2 border-border">
                        <AvatarImage src={org.image} alt={org.id} data-ai-hint={org.hint} />
                        <AvatarFallback>{org.id.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
