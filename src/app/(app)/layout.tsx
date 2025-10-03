'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { defaultNavItems } from '@/components/layout/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import type { Team } from '@/components/layout/team-switcher';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (!isUserLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isUserLoading, router]);

  useEffect(() => {
    if (!user) return;
    const personalTeam: Team = {
      id: 'user',
      label: user.displayName || user.email || 'Personal Account',
      isUser: true,
    };
    setTeams([personalTeam]);
    setSelectedTeam(personalTeam);
  }, [user]);

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isCollapsed={isCollapsed}
        teams={teams}
        selectedTeam={selectedTeam}
        setSelectedTeam={(t) => setSelectedTeam(t)}
        navItems={defaultNavItems}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}