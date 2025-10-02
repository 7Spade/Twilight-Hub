/**
 * @fileoverview A reusable card component to display a user's profile summary.
 * It can display either the currently authenticated user or a user specified by `userId`.
 * It fetches and shows the user's avatar, name, stats (followers/following),
 * achievements, and organization memberships.
 */

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { collection, doc, query, where, documentId } from 'firebase/firestore';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Mail, Users, User as UserIcon } from 'lucide-react';
import { useUser, useDoc, useFirestore, useCollection } from '@/firebase';
import { type Account, type Achievement, type UserAchievement } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

function UserProfileCardSkeleton() {
    return (
        <Card className="w-full">
            <CardContent className="p-6 flex flex-col items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="text-center space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-full" />
                <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /><Skeleton className="h-4 w-20" /></div>
                     <div className="flex items-center gap-2"><Users className="h-4 w-4" /><Skeleton className="h-4 w-20" /></div>
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><Skeleton className="h-4 w-40" /></div>
                </div>
                <Separator className="my-2" />
                <div className="w-full space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-10 w-10 rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export function UserProfileCard({ userId }: { userId?: string }) {
    const { user: authUser, isUserLoading: isAuthLoading } = useUser();
    const firestore = useFirestore();

    const displayUserId = userId || authUser?.uid;
    const isOwnProfile = !userId || (authUser?.uid === userId);

    const userProfileRef = useMemo(() => 
        (firestore && displayUserId ? doc(firestore, 'accounts', displayUserId) : null),
        [firestore, displayUserId]
    );
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<Account>(userProfileRef);

    const userAchievementsQuery = useMemo(
        () => (firestore && displayUserId ? collection(firestore, 'accounts', displayUserId, 'user_achievements') : null),
        [firestore, displayUserId]
    );
    const { data: userAchievements, isLoading: userAchievementsLoading } = useCollection<UserAchievement>(userAchievementsQuery);
    
    const achievementIds = useMemo(() => userAchievements?.map(ach => ach.achievementId) || [], [userAchievements]);

    const achievementsQuery = useMemo(() =>
        (firestore && achievementIds.length > 0
            ? query(collection(firestore, 'achievements'), where(documentId(), 'in', achievementIds))
            : null
        ), [firestore, achievementIds]
    );
    const { data: achievements, isLoading: achievementsLoading } = useCollection<Achievement>(achievementsQuery);
    
    const organizationsQuery = useMemo(() =>
        (firestore && displayUserId
            ? query(collection(firestore, 'accounts'), where('type', '==', 'organization'), where('memberIds', 'array-contains', displayUserId))
            : null
        ), [firestore, displayUserId]
    );
    const { data: organizations, isLoading: orgsLoading } = useCollection<Account>(organizationsQuery);

    const isLoading = isAuthLoading || isProfileLoading || userAchievementsLoading || achievementsLoading || orgsLoading;

    if (isLoading || !userProfile) {
        return <UserProfileCardSkeleton />;
    }
    
  const user = {
    name: userProfile.name || 'User',
    username: userProfile.username || 'username',
    slug: userProfile.slug || '',
    avatarUrl: userProfile.avatarUrl || getPlaceholderImage('avatar-1').imageUrl,
    followers: userProfile.followersCount || 0,
    following: userProfile.followingCount || 0,
    email: userProfile.email || 'user@example.com',
  };

  const fallbackText = user.name.charAt(0)?.toUpperCase() || 'U';

  return (
    <Card className="w-full">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24 border-2 border-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-muted text-4xl font-bold">
                {fallbackText}
            </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        {isOwnProfile && (
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/settings/profile`}>
                <UserIcon className="mr-2" /> Edit profile
            </Link>
          </Button>
        )}

        <div className='flex flex-col gap-2 w-full text-sm text-muted-foreground'>
             <Link href={`/${user.slug}?tab=followers`} className="flex items-center gap-2 hover:text-foreground">
                <Users className="h-4 w-4" />
                <span className="font-bold text-foreground">{user.followers}</span> followers
             </Link>
             <Link href={`/${user.slug}?tab=following`} className="flex items-center gap-2 hover:text-foreground">
                 <Users className="h-4 w-4" />
                <span className="font-bold text-foreground">{user.following}</span> following
            </Link>
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
            </div>
        </div>

        <Separator className="my-2" />
        <div className="w-full">
            <Link href={`/${user.slug}?tab=achievements`} className="group">
                <h3 className="font-semibold text-foreground mb-3 text-sm group-hover:underline">Achievements</h3>
                <div className="flex items-center gap-3">
                    {achievements && achievements.length > 0 ? (
                        achievements.slice(0, 5).map((ach) => (
                            <Avatar key={ach.id} className="h-10 w-10 border-2 border-border" title={ach.name}>
                                <AvatarImage src={getPlaceholderImage(ach.icon).imageUrl} alt={ach.name} data-ai-hint={getPlaceholderImage(ach.icon).imageHint} />
                                <AvatarFallback>{ach.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground">No achievements yet.</p>
                    )}
                </div>
            </Link>
        </div>


        {(organizations && organizations.length > 0) && (
            <>
                <Separator className="my-2" />
                <div className="w-full">
                    <h3 className="font-semibold text-foreground mb-3 text-sm">Organizations</h3>
                    <div className="flex items-center gap-3">
                        {organizations.slice(0,5).map((org, index) => (
                            <Avatar key={org.id} className="h-10 w-10 rounded-md border-2 border-border" title={org.name}>
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
