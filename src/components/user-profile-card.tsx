'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Mail, Smile, Users, User as UserIcon } from 'lucide-react';
import { useUser, useDoc, useFirestore, useCollection } from '@/firebase';
import { useMemo } from 'react';
import { collection, doc, query, where } from 'firebase/firestore';
import { type Account, type Achievement, type UserAchievement } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';

function UserProfileCardSkeleton() {
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
                <Separator className="my-2" />
                <div className="w-full space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export function UserProfileCard() {
    const { user: authUser, isUserLoading: isAuthLoading } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemo(() => 
        (firestore && authUser ? doc(firestore, 'accounts', authUser.uid) : null),
        [firestore, authUser]
    );
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<Account>(userProfileRef);

    const userAchievementsQuery = useMemo(
        () => (firestore && authUser ? collection(firestore, 'accounts', authUser.uid, 'user_achievements') : null),
        [firestore, authUser]
    );
    const { data: userAchievements, isLoading: userAchievementsLoading } = useCollection<UserAchievement>(userAchievementsQuery);
    
    const achievementIds = useMemo(() => userAchievements?.map(ach => ach.achievementId) || [], [userAchievements]);

    const achievementsQuery = useMemo(() =>
        (firestore && achievementIds.length > 0
            ? query(collection(firestore, 'achievements'), where('__name__', 'in', achievementIds))
            : null
        ), [firestore, achievementIds]
    );
    const { data: achievements, isLoading: achievementsLoading } = useCollection<Achievement>(achievementsQuery);
    
    const organizationsQuery = useMemo(() =>
        (firestore && authUser
            ? query(collection(firestore, 'accounts'), where('type', '==', 'organization'), where('memberIds', 'array-contains', authUser.uid))
            : null
        ), [firestore, authUser]
    );
    const { data: organizations, isLoading: orgsLoading } = useCollection<Account>(organizationsQuery);


    const isLoading = isAuthLoading || isProfileLoading || userAchievementsLoading || achievementsLoading || orgsLoading;

    if (isLoading || !userProfile || !authUser) {
        return <UserProfileCardSkeleton />;
    }
    
  const user = {
    name: userProfile.name || 'User',
    username: userProfile.username || 'username',
    avatarUrl: userProfile.avatarUrl || getPlaceholderImage('avatar-1').imageUrl,
    followers: userProfile.followersCount || 0,
    following: userProfile.followingCount || 0,
    email: userProfile.email || 'user@example.com',
  };

  const fallbackText = user.name.charAt(0)?.toUpperCase() || 'U';

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-muted text-5xl font-bold">
              {fallbackText}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 bg-background rounded-full p-1 border">
            <Smile className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        <Button variant="outline" className="w-full" asChild>
            <Link href={`/${userProfile.slug}`}>
                <UserIcon className="mr-2 h-4 w-4" /> Edit profile
            </Link>
        </Button>

        <div className='flex flex-col gap-2 w-full text-sm text-muted-foreground'>
            <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground">{user.followers}</span> follower{user.followers !== 1 && 's'}
                    <span className='font-bold'>·</span>
                    <span className="font-bold text-foreground">{user.following}</span> following
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
            </div>
        </div>

        {(achievements && achievements.length > 0) && (
            <>
                <Separator className="my-2" />
                <div className="w-full">
                    <h3 className="font-semibold text-foreground mb-3">Achievements</h3>
                    <div className="flex items-center gap-3">
                        {achievements.map((ach) => (
                            <Avatar key={ach.id} className="h-10 w-10 border-2 border-border">
                                <AvatarImage src={getPlaceholderImage(ach.icon).imageUrl} alt={ach.name} data-ai-hint={getPlaceholderImage(ach.icon).imageHint} />
                                <AvatarFallback>{ach.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                </div>
            </>
        )}

        {(organizations && organizations.length > 0) && (
            <>
                <Separator className="my-2" />
                <div className="w-full">
                    <h3 className="font-semibold text-foreground mb-3">Organizations</h3>
                    <div className="flex items-center gap-3">
                        {organizations.map((org, index) => (
                            <Avatar key={org.id} className="h-10 w-10 rounded-md border-2 border-border">
                                <AvatarImage src={getPlaceholderImage(`org-logo-${(index % 3) + 1}`).imageUrl} alt={org.name} data-ai-hint={getPlaceholderImage(`org-logo-${(index % 3) + 1}`).imageHint} />
                                <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
