'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Mail } from 'lucide-react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, getDocs, limit, documentId } from 'firebase/firestore';
import React, { useEffect, useState, useMemo } from 'react';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { PageContainer } from '@/components/layout/page-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FollowerList } from '@/components/follower-list';
import { MembershipList } from '@/components/membership-list';
import { SpacesView } from '@/features/spaces/components/spaces-view';
import { type Account, type Space } from '@/lib/types';

export default function UserProfilePage({
  params: paramsPromise,
}: {
  params: Promise<{ userslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!firestore) return;
      setIsLoading(true);
      const accountsRef = collection(firestore, 'accounts');
      const q = query(
        accountsRef,
        where('slug', '==', params.userslug),
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
  }, [firestore, params.userslug]);
  
  const userSpacesQuery = useMemo(() => {
    if (!firestore || !userProfile) return null;
    return query(collection(firestore, 'spaces'), where('ownerId', '==', userProfile.id));
  },[firestore, userProfile]);

  const { data: spacesData, isLoading: spacesLoading } = useCollection<Space>(userSpacesQuery);
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
      <div className="flex flex-col gap-8">
        <Card>
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="text-center md:text-left flex-1 space-y-2">
              <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-5 w-32 mx-auto md:mx-0" />
              <Skeleton className="h-5 w-48 mx-auto md:mx-0" />
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <div className="text-center space-y-1">
                  <Skeleton className="h-6 w-12 mx-auto" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
                <div className="text-center space-y-1">
                  <Skeleton className="h-6 w-12 mx-auto" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return <div>User not found.</div>;
  }

  const isOwnProfile = currentUser?.uid === userProfile.id;

  const displayName = userProfile.name || 'User';
  const username = userProfile.username || 'username';
  const email = userProfile.email || 'user@example.com';
  const avatarUrl =
    userProfile.avatarUrl || getPlaceholderImage('avatar-1').imageUrl;

  const followers = userProfile.followersCount || 0;
  const following = userProfile.followingCount || 0;

  return (
    <PageContainer title={displayName} description={`@${username}`}>
      <div className="grid gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="text-3xl">
                  {displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center gap-2 mt-2 text-muted-foreground justify-center md:justify-start">
                  <Mail className="h-4 w-4" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{following}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {isOwnProfile && (
                  <Button variant="outline" asChild>
                    <Link href="/settings">
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="spaces">
          <TabsList>
            <TabsTrigger value="spaces">Spaces</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
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
          <TabsContent value="followers" className="mt-6">
            <FollowerList userId={userProfile.id} />
          </TabsContent>
          <TabsContent value="memberships" className="mt-6">
            <MembershipList userId={userProfile.id} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
