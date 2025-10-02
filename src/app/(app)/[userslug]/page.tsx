'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { PageContainer } from '@/components/layout/page-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FollowerList } from '@/components/follower-list';
import { MembershipList } from '@/components/membership-list';
import { SpacesView } from '@/features/spaces/components/spaces-view';
import { StarredSpaces } from '@/components/starred-spaces';
import { FollowingList } from '@/components/following-list';
import { AchievementsList } from '@/components/achievements-list';
import { type Account, type Space } from '@/lib/types';
import { UserProfileCard } from '@/components/user-profile-card';
import { Skeleton } from '@/components/ui/skeleton';
import { GitHubHeatMap } from '@/components/github-heat-map';

function UserProfilePageContent({ userslug }: { userslug: string }) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'spaces';
  
  // Placeholder data for the heat map
  const heatMapData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const count = Math.random() > 0.3 ? Math.floor(Math.random() * 10) : 0;
      if (count > 0) {
        data.push({ date, count });
      }
    }
    return data;
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!firestore) return;
      setIsLoading(true);
      const accountsRef = collection(firestore, 'accounts');
      const q = query(
        accountsRef,
        where('slug', '==', userslug),
        where('type', '==', 'user'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserProfile({ id: userDoc.id, ...userDoc.data() } as Account);
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, [firestore, userslug]);

  const userSpacesQuery = useMemo(() => {
    if (!firestore || !userProfile) return null;
    return query(
      collection(firestore, 'spaces'),
      where('ownerId', '==', userProfile.id)
    );
  }, [firestore, userProfile]);

  const { data: spacesData, isLoading: spacesLoading } =
    useCollection<Space>(userSpacesQuery);
  const spaces = spacesData || [];

  const ownersMap = useMemo(() => {
    const map = new Map<string, Account>();
    if (userProfile) {
      map.set(userProfile.id, userProfile);
    }
    return map;
  }, [userProfile]);

  if (isLoading) {
    return (
        <div className="grid md:grid-cols-4 gap-8 items-start">
            <aside className="md:col-span-1">
                 <Skeleton className="h-[500px] w-full" />
            </aside>
            <main className="md:col-span-3">
                 <Skeleton className="h-10 w-full mb-6" />
                 <Skeleton className="h-96 w-full" />
            </main>
        </div>
    );
  }

  if (!userProfile) {
    return <div>User not found.</div>;
  }

  return (
    <PageContainer title={userProfile.name} description={`@${userProfile.username}`}>
       {userProfile.bio && <p className="text-muted-foreground max-w-2xl">{userProfile.bio}</p>}
      <div className="grid md:grid-cols-4 gap-8 items-start">
        <aside className="md:col-span-1">
          <UserProfileCard userId={userProfile.id} />
        </aside>
        <main className="md:col-span-3">
           <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Contribution Activity</h3>
              <GitHubHeatMap data={heatMapData} />
           </div>
          <Tabs defaultValue={defaultTab}>
            <TabsList>
              <TabsTrigger value="spaces">Spaces</TabsTrigger>
              <TabsTrigger value="stars">Stars</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="memberships">Memberships</TabsTrigger>
            </TabsList>
            <TabsContent value="spaces" className="mt-6">
              <SpacesView
                userId={currentUser?.uid}
                owners={ownersMap}
                isLoading={spacesLoading}
                yourSpaces={spaces}
                showYourSpacesTab={true}
              />
            </TabsContent>
            <TabsContent value="stars" className="mt-6">
              <StarredSpaces userId={userProfile.id} />
            </TabsContent>
            <TabsContent value="followers" className="mt-6">
              <FollowerList userId={userProfile.id} />
            </TabsContent>
            <TabsContent value="following" className="mt-6">
              <FollowingList userId={userProfile.id} />
            </TabsContent>
            <TabsContent value="achievements" className="mt-6">
              <AchievementsList userId={userProfile.id} />
            </TabsContent>
            <TabsContent value="memberships" className="mt-6">
              <MembershipList userId={userProfile.id} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PageContainer>
  );
}

export default function UserProfilePageWrapper({
  params: paramsPromise,
}: {
  params: Promise<{ userslug: string }>;
}) {
  const params = React.use(paramsPromise);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfilePageContent userslug={params.userslug} />
    </Suspense>
  );
}
