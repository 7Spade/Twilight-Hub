'use client';
import {
  FirebaseClientProvider,
  useUser,
  useFirestore,
  useCollection,
} from '@/firebase';
import React, { useMemo, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { collection, query, where, doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { CreateSpaceDialog } from '@/features/spaces/components/create-space-dialog';
import { CreateOrganizationDialog } from '@/components/create-organization-dialog';
import { CreateGroupDialog } from '@/components/create-group-dialog';
import { ChatDialog } from '@/components/chat-dialog';
import { type Team } from '@/components/layout/team-switcher';
import {
  LayoutDashboard,
  Grid3x3,
  Store,
  Users2,
  Package,
  Settings,
  Group,
  ScrollText,
  Compass,
} from 'lucide-react';
import { type NavItem } from '@/components/layout/nav';
import { useIsMobile } from '@/hooks/use-mobile';
import { InviteMemberDialog } from '@/components/invite-member-dialog';
import { UseModuleDialog } from '@/features/spaces/components/use-module-dialog';
import { type Account } from '@/lib/types';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const userProfileRef = useMemo(
    () => (firestore && user ? doc(firestore, 'accounts', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfileData, isLoading: isProfileLoading } =
    useDoc<Account>(userProfileRef);
  const userProfile = userProfileData;

  const userOrganizationsQuery = useMemo(
    () =>
      firestore && user
        ? query(
            collection(firestore, 'accounts'),
            where('type', '==', 'organization'),
            where('memberIds', 'array-contains', user.uid)
          )
        : null,
    [firestore, user]
  );
  const { data: organizationsData, isLoading: orgsLoading } = useCollection<Account>(
    userOrganizationsQuery
  );
  const organizations = organizationsData || [];

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const handleSetSelectedTeam = (team: Team) => {
    setSelectedTeam(team);
  };

  const teams = useMemo(() => {
    if (isUserLoading || isProfileLoading || !userProfile || !user) return [];

    const personalTeam: Team = {
      id: user.uid,
      label: userProfile.name || 'Personal Account',
      slug: userProfile.slug,
      isUser: true,
    };

    const orgTeams: Team[] = organizations.map((org) => ({
      id: org.id,
      label: org.name,
      slug: org.slug,
      isUser: false,
    }));

    const allTeams = [personalTeam, ...orgTeams];

    if (!selectedTeam && personalTeam) {
      setSelectedTeam(personalTeam);
    } else if (selectedTeam && !allTeams.find(t => t.id === selectedTeam.id)) {
      // If the selected team is no longer in the list (e.g., user left an org),
      // default back to the personal team.
      setSelectedTeam(personalTeam);
    }


    return allTeams;
  }, [
    isUserLoading,
    isProfileLoading,
    user,
    userProfile,
    organizations,
    selectedTeam,
  ]);
  
  const navItems = useMemo((): NavItem[] => {
    if (!selectedTeam) return [];

    if (selectedTeam.isUser) {
      return [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/spaces', icon: Grid3x3, label: 'Spaces' },
        { href: '/marketplace', icon: Store, label: 'Marketplace' },
        { href: '/organizations', icon: Users2, label: 'Organizations' },
        { href: '/discover', icon: Compass, label: 'Discover' },
      ];
    } else {
      const orgSlug = selectedTeam.slug;
      return [
        {
          href: `/organizations/${orgSlug}`,
          icon: LayoutDashboard,
          label: 'Overview',
        },
        {
          href: `/organizations/${orgSlug}/spaces`,
          icon: Grid3x3,
          label: 'Spaces',
        },
        {
          href: `/organizations/${orgSlug}/inventory`,
          icon: Package,
          label: 'Inventory',
        },
        {
          href: `/organizations/${orgSlug}/members`,
          icon: Users2,
          label: 'Members',
        },
        { href: `/organizations/${orgSlug}/groups`, icon: Group, label: 'Groups' },
        {
          href: `/organizations/${orgSlug}/audit-log`,
          icon: ScrollText,
          label: 'Audit Log',
        },
        {
          href: `/organizations/${orgSlug}/settings`,
          icon: Settings,
          label: 'Settings',
        },
      ];
    }
  }, [selectedTeam]);

  const isLoading = isUserLoading || isProfileLoading || orgsLoading;
  const currentOrgId =
    selectedTeam && !selectedTeam.isUser ? selectedTeam.id : undefined;

  return (
    <>
      <CreateSpaceDialog selectedTeam={selectedTeam} />
      <CreateOrganizationDialog />
      <UseModuleDialog />
      {currentOrgId && <CreateGroupDialog organizationId={currentOrgId} />}
      {currentOrgId && <InviteMemberDialog organizationId={currentOrgId} />}
      <ChatDialog />
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        {!isMobile && (
          <Sidebar
            isCollapsed={isCollapsed}
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={handleSetSelectedTeam}
            navItems={navItems}
          />
        )}
        <div
          className={`flex flex-col sm:gap-4 sm:py-4 transition-[padding-left] sm:duration-300 ${
            !isMobile && (isCollapsed ? 'sm:pl-14' : 'sm:pl-56')
          }`}
        >
          <Header
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            navItems={navItems}
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={handleSetSelectedTeam}
            userProfile={userProfile}
          />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {isLoading ? <div>Loading...</div> : children}
          </main>
        </div>
      </div>
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </FirebaseClientProvider>
  );
}
