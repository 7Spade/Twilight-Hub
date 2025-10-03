/**
 * @fileoverview Fetches and displays a list of achievements for a given user.
 * It queries the user's unlocked achievements and then fetches the corresponding
 * global achievement definitions to display their details.
 */

'use client';

import React, { useMemo } from 'react';
import { collection, query, where, documentId } from 'firebase/firestore';

import { useFirestore, useCollection } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { type UserAchievement, type Achievement } from '@/lib/types';
import { Trophy } from 'lucide-react';


function AchievementSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex-row items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export function AchievementsList({ userId }: { userId: string }) {
  const firestore = useFirestore();

  const userAchievementsQuery = useMemo(
    () => (firestore ? collection(firestore, 'accounts', userId, 'user_achievements') : null),
    [firestore, userId]
  );
  const { data: userAchievements, isLoading: userAchievementsLoading } = useCollection<UserAchievement>(
    userAchievementsQuery
  );

  const achievementIds = useMemo(
    () => userAchievements?.map((ach) => ach.achievementId) || [],
    [userAchievements]
  );

  const achievementsQuery = useMemo(
    () =>
      firestore && achievementIds.length > 0
        ? query(
            collection(firestore, 'achievements'),
            where(documentId(), 'in', achievementIds)
          )
        : null,
    [firestore, achievementIds]
  );
  const { data: achievements, isLoading: achievementsLoading } =
    useCollection<Achievement>(achievementsQuery);

  const isLoading = userAchievementsLoading || achievementsLoading;

  if (isLoading) {
    return <AchievementSkeleton />;
  }

  if (!achievements || achievements.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        This user has no achievements yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => {
        const iconUrl = achievement.icon ? getPlaceholderImage(achievement.icon).imageUrl : getPlaceholderImage('achievement-1').imageUrl;
        const iconHint = achievement.icon ? getPlaceholderImage(achievement.icon).imageHint : getPlaceholderImage('achievement-1').imageHint;
        return (
            <Card key={achievement.id}>
            <CardHeader className="flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={iconUrl} alt={achievement.name} data-ai-hint={iconHint} />
                    <AvatarFallback><Trophy/></AvatarFallback>
                </Avatar>
                <div>
                <CardTitle className="text-lg">{achievement.name}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
                </div>
            </CardHeader>
            </Card>
        );
      })}
    </div>
  );
}
